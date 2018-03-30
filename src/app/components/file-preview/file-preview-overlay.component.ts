import { Component, Input } from '@angular/core';

@Component({
    selector: 'file-preview-overlay',
    template: `<h1>Hello World!</h1>`,
    styles: [`
        :host {
            display: block;
            background: white;
        }

        h1 {
            margin: 0;
            padding: 1em;
        }
    `]
})
export class FilePreviewOverlayComponent {

}
