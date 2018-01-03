import { Component, Input, OnInit, OnDestroy, forwardRef, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, Subscription, Subject } from "rxjs";
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';

export interface ITypeAheadListSource {
    search(term: string): Observable<{ name: string }[]>;
}


@Component({
    selector: 'typeahead',
    template: `
        <div class="typeahead" [ngClass]="{'open': items && items.length }">
            <input type="text" 
                [attr.placeholder]="placeholder" 
                [disabled]="!source" 
                [(ngModel)]="data"
                (keyup)="search($event, term.value)" 
                (keypress)="onKeyPress($event)" 
                (blur)="leave()" 
                class="form-control" 
                #term />
            <ul *ngIf="items && items.length" class="list-group">
                <li *ngFor="let item of items" (click)="select(item)" [ngClass]="{ 'list-group-item':true, 'hover':item == hover }">
                    {{ item.name }}
                </li>
            </ul>
            <span *ngIf="loading" class="fa fa-spinner fa-pulse text-muted"></span>
            <span *ngIf="hasError" class="fa fa-exclamation-triangle text-danger"></span>
        </div>
    `,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TypeAheadComponent),
            multi: true,
        }
    ]
})
export class TypeAheadComponent implements OnInit, ControlValueAccessor {
    @Input() source: ITypeAheadListSource;
    @Input() placeholder: string;

    public data: string = null;
    public items: { name: string }[];
    public selected: EventEmitter<{ name: string }> = new EventEmitter();

    public minTermLength: number = 2;
    public loading: boolean = false;
    public hasError: boolean = false;

    private searchTermStream: Subject<string>;
    private obs: Observable<{ name: string }[]>;


    constructor() {

    }

    ngOnInit(): void {
        this.searchTermStream = new Subject<string>();
        this.selected.emit(null);
        this.obs = this.searchTermStream
            .filter((term: string) => term.length >= this.minTermLength)
            .debounceTime(300)
            .distinctUntilChanged()
            .switchMap((term: string) => {
                this.loading = true;
                this.hasError = false;
                return this.source.search(term)
            });

        this.obs
            .subscribe(items => {
                this.items = items;
                this.loading = false;
            }, error => {
                this.loading = false;
                this.hasError = true;
            });
    }


    search(event: any, term: string) {
        if (event.key == 'Escape' || event.key == 'Tab') {
            return;
        }

        this.setData(term);

        if (term.length < this.minTermLength) {
            this.clearItems();
        }

        if (this.source != null) {
            this.searchTermStream.next(term);
        }
    }

    select(item: { name: string }) {
        this.clearItems();
        this.setData(item.name);
        this.selected.emit(item);
    }

    setData(value: string) {
        this.data = value;
        this.propagateChange(value);
    }

    leave() {
        setTimeout(x => this.clearItems(), 300);
    }

    clearItems() {
        this.items = [];
    }

    onKeyPress(event: any): boolean {
        if (event.key == 'Tab') {
            if (this.items && this.items.length > 0) {
                this.select(this.items[0]);
                return false;
            }

            if ((this.items == null || this.items.length == 0) && !this.loading) {
                return true;
            }

            return false;
        }
        else if (event.key == 'Escape') {
            this.clearItems();
            return false;
        }

        return true;
    }


    /* --- ControlValueAccessor -- */

    private propagateChange = (_: any) => {
        
    };

    writeValue = (obj: any) => {
        this.data = obj;
    }

    registerOnChange = (fn: any) => {
        this.propagateChange = fn;
    }

    registerOnTouched = (fn: any) => {
        
    }

    setDisabledState = (isDisabled: boolean) => {
        
    }
}
