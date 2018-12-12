import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Injectable, HostListener, Directive } from '@angular/core';
import { Subscription, Subject } from 'rxjs';

export interface ColumnSortedEvent {
    sortColumn: string;
    sortDirection: string;
}


@Injectable()
export class SortService {
    private columnSortedSource = new Subject<ColumnSortedEvent>();
    columnSorted$ = this.columnSortedSource.asObservable();

    constructor() { }

    columnSorted(event: ColumnSortedEvent) {
        this.columnSortedSource.next(event);
    }
}



@Component({
    selector: '[sortable-column]',
    template: `
    <div style="cursor:pointer">
        <i *ngIf="sortDirection === 'asc'" class="fa fa-chevron-up" style="color:green"></i>
        <i *ngIf="sortDirection === 'desc'" class="fa fa-chevron-down" style="color:red"></i>
        <ng-content></ng-content>
    </div>
    `
})
export class SortableColumnComponent implements OnInit, OnDestroy {
    @Input('sortable-column') columnName: string;
    @Input('sort-direction') sortDirection: string = '';
    private columnSortedSubscription: Subscription;

    constructor(private sortService: SortService) { }

    @HostListener('click')
    sort() {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        this.sortService.columnSorted({ sortColumn: this.columnName, sortDirection: this.sortDirection });
    }

    ngOnInit() {
        this.columnSortedSubscription = this.sortService.columnSorted$.subscribe(event => {
            if (this.columnName !== event.sortColumn) {
                this.sortDirection = '';
            }
        });
    }

    ngOnDestroy() {
        this.columnSortedSubscription.unsubscribe();
    }
}



@Directive({
    selector: '[sortable-table]'
})
export class SortableTableDirective implements OnInit, OnDestroy {
    @Output() sorted = new EventEmitter();
    private columnSortedSubscription: Subscription;

    constructor(private sortService: SortService) {}

    ngOnInit() {
        this.columnSortedSubscription = this.sortService.columnSorted$.subscribe(event => {
            this.sorted.emit(event);
        });
    }

    ngOnDestroy() {
        this.columnSortedSubscription.unsubscribe();
    }
}
