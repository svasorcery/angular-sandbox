import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'modal',
    template: `
        <div *ngIf="visible" class="modal-dialog" [class.wide]="wide">
            <h2>{{ header }}</h2>
            <button *ngIf="closable" (click)="close()" aria-label="Close" class="modal-dialog-close-btn">
                <span class="fa fa-close"></span>
            </button>
            <div class="modal-dialog-content">
                <ng-content></ng-content>
            </div>
        </div>
        <div *ngIf="visible" class="overlay" (click)="close()"></div>
    `,
    styles: [`
        .overlay {
            position: fixed;
            z-index: 999;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: rgba(0, 0, 0, 0.5);
        }

        .modal-dialog {
            position: fixed;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            padding: 12px;
            top: 20px;
            left: 0;
            right: 0;
            margin-right: auto;
            margin-left: auto;
            height: 50%;
            width: 90%;
            max-width: 75%;
            background-color: #fff;
            box-shadow: 0 7px 8px -4px rgba(0, 0, 0, 0.2), 0 13px 19px 2px rgba(0, 0, 0, 0.14), 0 5px 24px 4px rgba(0, 0, 0, 0.12);
        }
        
        .wide {
            height: 80%;
            width: 80%; 
        }

        @media (min-width: 768px) {
            .modal-dialog {
                top: 40px;
            }
        }

        .modal-dialog-content {
            padding: 20px;
            overflow: auto;
        }

        .modal-dialog-close-btn {
            position: absolute;
            border: 0;
            background: none;
            color: #2d2d2d;
            top: 20px;
            right: 20px;
            font-size: 1.5em;
        }
    `]
})
export class ModalComponent {
    @Input() header: string = '';
    @Input() closable: boolean = true;
    @Input() visible: boolean = false;
    @Input() wide: boolean = false;


    @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor() { }

    close() {
        this.visible = false;
        this.visibleChange.emit(this.visible);
    }
}
