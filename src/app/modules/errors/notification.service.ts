import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';


@Injectable()
export class NotificationService {
    private _notification: Subject<string>;
    readonly notification$: Observable<any>;

    constructor() {
        this._notification = new Subject();
        this.notification$ = this._notification.asObservable();
    }

    public notify = (message) => {
        console.error(message);
        this._notification.next(message);
    }
}
