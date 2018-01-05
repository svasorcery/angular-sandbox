import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'error',
    template: `
        <div *ngIf="active">
            <div class="alert alert-danger" [class.alert-dismissible]="dismissible" role="alert">
                <button *ngIf="dismissible" type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                <i class="fa fa-warning fa-3x pull-left"></i>
                <div class="text-center">
                    <h4>{{ message }}</h4>
                    <h5>{{ details }}</h5>
                </div>
            </div>
            <div *ngIf="refreshable" class="text-center">
                <a (click)="refresh()" style="cursor:pointer">
                    <h4>
                        <span class="fa fa-refresh"></span>
                        Обновить страницу
                    </h4>
                </a>
            </div>
        </div>
    `
})
export class ErrorComponent {
    @Input() active: boolean;
    @Input() dismissible: boolean = false;
    @Input() refreshable: boolean = true;

    @Input() message: string = `
        Во время обработки Вашего запроса возникла проблема.`;
    @Input() details: string = `
        Попробуйте повторить запрос через несколько минут.
        Если ошибка повторилась, обратитесь в Службу поддержки.`;

    constructor() { }

    refresh() {
        window.location.reload();  
    }
}
