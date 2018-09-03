import { Directive, Input, Output, HostListener, Injectable, Inject } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Observable, from } from 'rxjs';

@Injectable()
export class ClipboardService {
    constructor(@Inject(DOCUMENT) private _dom: Document) { }

    public copy(value: string): Observable<string> {
        if (!value) { return from(''); }

        let textarea = null;
        try {
            textarea = this._dom.createElement('textarea');
            textarea.style.height = '0px';
            textarea.style.left = '-100px';
            textarea.style.opacity = '0';
            textarea.style.position = 'fixed';
            textarea.style.top = '-100px';
            textarea.style.width = '0px';
            this._dom.body.appendChild(textarea);

            textarea.value = value;
            textarea.select();

            this._dom.execCommand('copy');

        } finally {
            if (textarea && textarea.parentNode) {
                textarea.parentNode.removeChild(textarea);
            }
        }

        return from(value);
    }

}

@Directive({
    selector: '[clipboard]'
})
export class ClipboardDirective {
    @Input('clipboard') value: string;

    @Output('clipboardCopy') copyEvent: EventEmitter<string>;
    @Output('clipboardError') errorEvent: EventEmitter<Error>;

    constructor(private _clipboard: ClipboardService) {
        this.copyEvent = new EventEmitter();
        this.errorEvent = new EventEmitter();
        this.value = '';
    }

    @HostListener('click')
    public copyToClipboard = () =>
        this._clipboard
            .copy(this.value)
            .subscribe(
                (value: string) => this.copyEvent.emit(value),
                (error: Error): void => this.errorEvent.emit(error)
            )
}
