import { Component, Input } from '@angular/core';

@Component({
    selector: 'status-indicator',
    template: `
        <i [class.fa-pulse]="pulse">
            <i *ngIf="!value" class="fa fa-circle" style="color:#ccc"></i>
            <i *ngIf="value == 'success'" class="fa fa-circle" style="color:#4CAF50"></i>
            <i *ngIf="value == 'warning'" class="fa fa-circle" style="color:#FFA100"></i>
            <i *ngIf="value == 'danger'" class="fa fa-circle" style="color:#F44336"></i>
        </i>
    `,
    styles: [`
        .fa-pulse {
            display: inline-block;
            -moz-animation: pulse 3s infinite linear;
            -o-animation: pulse 3s infinite linear;
            -webkit-animation: pulse 3s infinite linear;
            animation: pulse 3s infinite linear;
        }
        @-webkit-keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
        @-moz-keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
        @-o-keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
        @-ms-keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
    `]
})
export class StatusIndicatorComponent {
    @Input() value: 'success' | 'warning' | 'danger' = null;
    @Input() pulse: boolean = true;

    constructor() { }
}
