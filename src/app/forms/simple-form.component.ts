import { Component } from '@angular/core';

import { AbstractForm } from './forms.abstractions';

@Component({
    selector: 'simple-form',
    template: `
        <form #form="ngForm" novalidate (submit)="submit()" *ngIf="value">

            <ng-content></ng-content>

            <div class="form-group">
                <button type="submit" [disabled]="form.invalid" class="btn btn-primary pull-right">Сохранить</button>
                <a (click)="cancel()" class="btn btn-default">Отмена</a>
            </div>
        </form>
    `,
    styleUrls: [ './control-validation.css' ]
})
export class SimpleFormComponent<T> extends AbstractForm<T> {
    constructor() {
        super();
        this.disabled = false;
    }
}
