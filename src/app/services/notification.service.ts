import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';


@Injectable()
export class NotificationService {
    private _notification: Subject<string>;
    readonly changed$: Observable<any>;

    constructor() {
        this._notification = new Subject();
        this.changed$ = this._notification.asObservable();
    }

    public notify = (message) => this._notification.next(message);
}
