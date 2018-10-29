import { Input, Output, EventEmitter } from '@angular/core';

export abstract class AbstractForm<T> {
    @Input() value: T;
    @Output('save') onSubmit: EventEmitter<T> = new EventEmitter();
    @Output('cancel') onCancel: EventEmitter<boolean> = new EventEmitter();
    protected disabled: boolean;

    protected submit() {
        if (!this.value) { return; }
        this.onSubmit.emit(this.value);
    }

    protected cancel() {
        this.onCancel.emit(true);
    }
}
