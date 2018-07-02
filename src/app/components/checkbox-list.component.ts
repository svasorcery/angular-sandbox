import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

export interface ListItem {
    name: string;
}

export class CheckboxListItem implements ListItem {
    constructor(
        public name: string,
        public selected: boolean
    ) { }
}

@Component({
    selector: 'checkbox-list',
    template: `
        <ul class="list-group">
            <li *ngFor="let item of items"
                (click)="toggleItem(item)"
                class="list-group-item"
                [class.selected]="item.selected">
                <input type="checkbox"
                    [checked]="item.selected" />
                {{ item.name }}
            </li>
        </ul>
    `,
    styles: [`
        li {  cursor: pointer; }
        li.selected { background-color: #fffddd; }
        li:hover { background-color: #4189c7; color: #ffffff; }
    `]
})

export class CheckboxListComponent implements OnInit {
    @Input('items') inputItems: ListItem[] = [];
    @Input('selectedIndexes') inputIndexes: number[] = [];

    @Output('selectedItems') onSelectItems: EventEmitter<ListItem[]> = new EventEmitter();
    @Output('selectedIndexes') onSelectIndexes: EventEmitter<number[]> = new EventEmitter();

    items: CheckboxListItem[] = [];

    constructor() { }

    ngOnInit() {
        if (!this.inputItems) { return; }

        this.items = this.inputItems.map(i => new CheckboxListItem(i.name, false));

        if (!this.inputIndexes || this.inputIndexes.length === 0 ) {
            return;
        }

        this.inputIndexes.forEach(i => this.toggleItem(this.items[i]));
    }

    public toggleItem(item: CheckboxListItem): void {
        if (!item) { return; }

        item.selected = !item.selected;
        this.emitUpdate();
    }

    private emitUpdate(): void {
        if (!this.items) { return; }

        const selected = this.items.filter(i => i.selected);
        this.onSelectItems.emit(selected);
        this.onSelectIndexes.emit(selected.map(i => this.items.indexOf(i)));
    }
}
