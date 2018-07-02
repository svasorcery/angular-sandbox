import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType } from '@angular/common/http';

export class Attachment {
    id: number;
    contentType: string;
    contentLength: number;
    url: string;
}


@Component({
    selector: 'file-upload',
    template: `
        <input type="file" #file
            [multiple]="multiple"
            [attr.accept]="accept"
            (change)="change(file.files)"
            name="file-1[]" id="file-1"
            [class]="'inputfile ' + type"
            />
        <label for="file-1">
            <i class="fa fa-upload"></i>
            <span *ngIf="!fileName">Выберите файл...</span>
            <span *ngIf="fileName">
                <i *ngIf="progress > 0 && progress < 100" class="fa fa-spinner fa-pulse fa-fw"></i>
                {{ fileName }}
            </span>
        </label>
        <div class="status">
            <span *ngIf="progress > 0 && progress < 100">{{ progress }}%</span>
            <span *ngIf="message">{{ message }}</span>
        </div>
        <div *ngIf="preview && attachments" class="row col-md-12">
            <span *ngFor="let attach of attachments" class="col-md-1">
                <a [href]="attach.url" target="_blank" class="thumbnail" height="100px">
                    <img [src]="attach.url" />
                </a>
            </span>
        </div>
    `,
    styles: [`
        .status {
            font-weight: bold;
            color: green;
            height: 34px;
            vertical-align: center;
        }
        .inputfile {
            width: 0.1px;
            height: 0.1px;
            opacity: 0;
            overflow: hidden;
            position: absolute;
            z-index: -1;
        }
        .inputfile + label {
            max-width: 80%;
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
        }
        .inputfile:focus + label,
        .inputfile.has-focus + label {
            outline: 1px dotted #000;
            outline: -webkit-focus-ring-color auto 5px;
        }

        /* style 1 */
        .primary + label {
            color: #ffffff;
            background-color: #337ab7;
        }
        .primary:focus + label,
        .primary.has-focus + label,
        .primary + label:hover {
            background-color: #286090;
        }

        /* style 2 */
        .primary-inverse + label {
            color: #337ab7;
            border: 2px solid currentColor;
        }
        .primary-inverse:focus + label,
        .primary-inverse.has-focus + label,
        .primary-inverse + label:hover {
            color: #286090;
        }
    `]
})
export class FileUploadComponent {
    @Input() type: 'primary' | 'primary-inverse' = 'primary';
    @Input() accept: string = '.jpg';
    @Input() multiple: boolean = true;
    @Input() preview: boolean = true;

    @Output('change') onChange: EventEmitter<Attachment[]> = new EventEmitter();

    progress: number;
    message: string;
    fileName: string;
    attachments: Attachment[] = [];

    constructor(private _http: HttpClient) { }

    public change(files: File[]): void {
        this.upload(files);
        this.changeText(files);
    }

    private upload(files: File[]): void {
        if (files.length === 0) { return; }

        const formData = new FormData();

        for (const file of files) {
            formData.append(file.name, file);
        }

        const uploadReq = new HttpRequest('POST', `api/attachments`, formData, {
            reportProgress: true,
        });

        this._http.request(uploadReq).subscribe(event => {
            if (event.type === HttpEventType.UploadProgress) {
                this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event.type === HttpEventType.Response) {
                this.message = event.body['message'];
                (event.body['attachments'] as Attachment[]).forEach(x => this.attachments.push(x));
                this.onChange.emit(this.attachments);
            }
        });
    }

    private changeText(files: File[]): void {
        if (files.length === 0) { return; }

        if (files.length > 1) {
            this.fileName = `Выбрано ${files.length} файла`;
        } else {
            const name = files[0].name;
            this.fileName = name.length < 20 ? name
                : name.substring(0, 15).concat('...', name.substring(name.length - 3));
        }
    }
}
