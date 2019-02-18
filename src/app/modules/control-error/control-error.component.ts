import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <p class="help text-danger" [class.hide]="_hide">{{_text}}</p>
    `,
    styles: [`
        .hide { display: none; }
    `]
})
export class ControlErrorComponent {
    _text: string;
    _hide: boolean = true;

    @Input() set text(value) {
        if (value !== this._text) {
            this._text = value;
            this._hide = !value;
            this.cdr.detectChanges();
        }
    }

    constructor(private cdr: ChangeDetectorRef) { }
}
