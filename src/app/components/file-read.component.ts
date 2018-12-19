import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'file-read',
    template: `
        <input type="file" #file
            multiple="false"
            [attr.accept]="accept"
            (change)="readFile(file.files[0])"
            id="from-file"
            class="inputfile">
        <label for="from-file">
            <i class="fa fa-file-word-o"></i>
            <span>из файла</span>
        </label>

        <modal [visible]="locked" [closable]="false" [disabled]="true" [small]="true">
            <h1 class="text-center">
                {{ progress }}%
            </h1>
        </modal>
    `,
    styles: [`
        .inputfile {
            width: 0.1px;
            height: 0.1px;
            opacity: 0;
            overflow: hidden;
            position: absolute;
            z-index: -1;
        }
        .inputfile + label {
            height: 34px;
            font-size: 1.25rem;
            font-weight: 700;
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: pointer;
            display: inline-block;
            overflow: hidden;
            padding: 0.625rem 1.25rem;
            border-radius: 5px;
            color: #337ab7;
            border: 2px solid currentColor;
        }
        .inputfile:focus + label,
        .inputfile.has-focus + label {
            outline: 1px dotted #000;
            outline: -webkit-focus-ring-color auto 5px;
            color: #286090;
        }
        .inputfile + label:hover {
            color: #286090;
        }
    `]
})
export class FileReadComponent {
    @Input() accept: string = '.txt';
    @Input() encoding: string = 'UTF-8';
    @Input() sizeLimitKb: number = 51200;
    @Output('read') onChange: EventEmitter<string | ArrayBuffer> = new EventEmitter();
    @Output('progress') onProgressChange: EventEmitter<number> = new EventEmitter();

    locked: boolean = false;
    progress: number;

    constructor() { }

    public readFile(file: File): void {
        if (!file) { return; }

        if ((file.size / 1024) > this.sizeLimitKb) {
            alert(`Файл превышает максимальный размер ${this.sizeLimitKb} Kb`);
            return;
        }

        this.locked = true;
        const that = this;
        const reader = new FileReader();
        reader.readAsText(file, this.encoding);

        reader.onprogress = (data) => {
            if (data.lengthComputable) {
                that.progress = parseInt(((data.loaded / data.total) * 100).toString(), 10);
                that.onProgressChange.emit(that.progress);
            }
        };

        reader.onload = () => {
            that.progress = 100;
            that.onProgressChange.emit(100);
            this.locked = false;
            that.onChange.emit(reader.result);
        };

        reader.onloadend = () => { };
    }
}
