import { Component, Input, forwardRef, ElementRef, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'combo-box',
    template: `
        <div class="combo-box" [class.open]="source?.length" [class.disabled]="disabled">
            <span (click)="toggleSourceList()"
                class="input-arrow fa"
                [class.fa-caret-up]="!disabled && sourceState !== 'hide'"
                [class.fa-caret-down]="disabled || sourceState === 'hide'">
            </span>
            <input type="text"
                [(ngModel)]="label"
                [attr.placeholder]="placeholder"
                [disabled]="!source || disabled"
                [name]="name"
                (click)="toggleSourceList()"
                (keydown)="onKeyDown($event)"
                #term />
            <div class="list-group-wrapper">
                <ul *ngIf="!disabled && sourceState !== 'hide'" class="list-group">
                    <li *ngIf="nullable"
                        (click)="select(null)"
                        class="list-group-item">
                        {{ placeholder }}
                    </li>
                    <li *ngIf="!nullable"
                        class="list-group-item non-nullable">
                        {{ placeholder }}
                    </li>
                    <ng-container *ngIf="sourceState === 'full'">
                        <li *ngFor="let item of source"
                            (click)="select(item)"
                            class="list-group-item"
                            [class.hover]="item===hover">
                            {{ item[displayAttr] || item || '' }}
                        </li>
                    </ng-container>
                    <ng-container *ngIf="sourceState === 'filtered'">
                        <li *ngFor="let item of source | filter:term.value:displayAttr:true"
                            (click)="select(item)"
                            class="list-group-item"
                            [class.hover]="item===hover">
                            {{ item[displayAttr] || item || '' }}
                        </li>
                    </ng-container>
                </ul>
            </div>
        </div>
    `,
    styles: [`
        .input-arrow {
            position: absolute;
            display: block;
            right: 15px;
            top: 19px;
            width: 10px;
            height: 5px;
        }
        input::-ms-clear {
            display: none;
        }
        .combo-box {
            position: relative;
            display: inline-block;
            width: 100%;
            color: #5c5f62;
            font-family: "Lato-Regular";
            font-size: 14px;
            line-height: 40px;
            outline: none;
            box-sizing: border-box;
            cursor: pointer;
        }
        .combo-box input {
            width: 100%;
            color: #012A3A;
            font-family: "Lato-Regular";
            font-size: 16px;
            line-height: 40px;
            outline: none;
            border: 1px solid #0097A7;
            padding: 0px 10px;
            box-sizing: border-box;
            cursor: pointer;
            background: #FFFFFF;
        }
        .combo-box input::-webkit-input-placeholder {
            color: #012A3A
        }
        .combo-box input::-moz-placeholder {
            color: #012A3A
        }
        .combo-box input::-moz-placeholder {
            color: #012A3A
        }
        .combo-box input::-ms-input-placeholder {
            color: #012A3A
        }
        .combo-box input:focus {

        }
        .disabled {
            cursor: default;
        }
        .disabled input {
            cursor: default;
            color: #B0BEC5;
            border: 1px solid #B0BEC5;
        }
        .disabled input::-webkit-input-placeholder {
            color: #B0BEC5
        }
        .disabled input::-moz-placeholder {
            color: #B0BEC5
        }
        .disabled input::-moz-placeholder {
            color: #B0BEC5
        }
        .disabled input::-ms-input-placeholder {
            color: #B0BEC5
        }
        .list-group-wrapper {
            position: absolute;
            width: 100%;
            max-height: 400px;
            background: #FFFFFF;
            z-index: 1000;
        }
        .list-group {
            width: 100%;
            max-height: 400px;
            overflow: auto;
            z-index: 1000;
            border: 1px solid #0097A7;
            text-align: left;
            box-sizing: border-box;

            background: #FFFFFF;
        }
        .list-group-item:first-child {
            border-top-left-radius: 0;
            border-top-right-radius: 0;
        }
        .list-group-item {
            color: #012A3A;
            font-family: "Lato-Regular";
            font-size: 16px;
            line-height: 30px;
            padding: 10px 10px;
            cursor: pointer;
            box-sizing: border-box;
            text-transform: uppercase;
        }
        .list-group-item:hover, .list-group-item.hover {
            background: #ECEFF1;
        }
        .list-group-item.non-nullable {
            color: grey;
        }
    `],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: forwardRef(() => ComboBoxComponent),
        }
    ]
})
export class ComboBoxComponent implements ControlValueAccessor {
    @Input() source: string[] | any[];
    @Input() displayAttr: string = 'name';
    @Input() name: string;
    @Input() placeholder: string = 'Введите значение для поиска';
    @Input() nullable: boolean = false;
    @Input() disabled: boolean = false;

    public value: any = '';
    public label: string = '';
    public sourceState: 'hide' | 'full' | 'filtered' = 'hide';
    public hover: any = null;
    public hoverIndex = -1;

    constructor(private _elem: ElementRef) { }

    @HostListener('document:click', ['$event'])
    clickout = (event: Event) => {
        if (!this._elem.nativeElement.contains(event.target)) {
            this.hideSourceList();
        }
    }

    public toggleSourceList = () => {
        switch (this.sourceState) {
            case 'hide': this.sourceState = 'full'; break;
            case 'full': this.sourceState = (!!this.label && this.source.length > 1) ? 'filtered' : 'hide'; break;
            default: this.sourceState = 'hide'; break;
        }
    }

    public hideSourceList = () => this.sourceState = 'hide';

    public leave(): void {
        this.label = this.source && this.source.length ? this.value['name'] : '';
        this.hideSourceList();
    }

    public select = (item: any) => {
        this.setValue(item);
        this.setLabel(item);
        this.hideSourceList();
    }

    public onKeyDown(event: any): boolean {
        if (this.sourceState === 'full') {
            this.toggleSourceList();
        }

        if (event.key === 'Tab') {
            if (this.source && this.source.length === 1) {
                this.select(this.source[0]);
                return false;
            }

            if (this.source && this.source.length > 0) {
                if (this.hover == null) {
                    this.hoverIndex = 0;
                } else {
                    this.hoverIndex++;
                }

                if (this.hoverIndex >= this.source.length) {
                    this.hoverIndex = 0;
                }
                this.hover = this.source[this.hoverIndex];
            }

            if ((this.source == null || this.source.length === 0)) {
                return true;
            }

            return false;
        } else if (event.key === 'Escape') {
            this.hideSourceList();
            return false;
        } else if (event.key === 'Enter') {
            if (this.hover != null) {
                this.select(this.hover);
                return false;
            }
        } else if (event.key === 'ArrowDown') {
            if (this.source && this.source.length > 0) {
                this.hoverIndex++;
                if (this.hoverIndex >= this.source.length) {
                    this.hoverIndex = 0;
                }
                this.hover = this.source[this.hoverIndex];
            }
            return false;
        } else if (event.key === 'ArrowUp') {
            if (this.source && this.source.length > 0) {
                this.hoverIndex--;
                if (this.hoverIndex < 0) {
                    this.hoverIndex = this.source.length - 1;
                }
                this.hover = this.source[this.hoverIndex];
            }
            return false;
        }

        this.setValue(null);
        return true;
    }

    private setValue = (value: string) => {
        this.value = value;
        this.propagateChange(value);
    }

    private setLabel = (value: string): void => {
        this.label = !value ? '' :
            typeof(value) === 'string' ?
                value as string :
                value[this.displayAttr];
    }

    /* --- ControlValueAccessor -- */
    writeValue = (obj: any) => {
        this.value = obj;
        this.setLabel(obj);
    }
    private propagateChange = (_: any) => { };
    registerOnChange = (fn: any) => this.propagateChange = fn;
    registerOnTouched = (fn: any) => { };
    setDisabledState = (isDisabled: boolean) => { };
}
