import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { LockedObject } from './locking.models';
import { WebSocketsService } from '../websockets';

@Injectable()
export class LockingService {
    allLocked$: Observable<LockedObject[]>;
    finded$: Observable<LockedObject>;
    locked$: Observable<LockedObject>;
    unlocked$: Observable<LockedObject>;
    unlockedAll$: Observable<any>;
    error$: Observable<any>;

    constructor(private _ws: WebSocketsService) {
        this.allLocked$ = this._ws.on<LockedObject[]>('GetAllLockedObjects');
        this.finded$ = this._ws.on<LockedObject>('GetLockedObject');
        this.locked$ = this._ws.on<LockedObject>('Lock');
        this.unlocked$ = this._ws.on<LockedObject>('UnLock');
        this.unlockedAll$ = this._ws.on<any>('UnlockAll');
        this.error$ = this._ws.on<any>('Error');
    }


    public list = () => this._ws.send('GetAllLockedObjects', {});

    public find = (key: string) => this._ws.send('GetLockedObject', { key: key });

    public lock = (key: string) => this._ws.send('Lock', { key: key });

    public unlock = (key: string) => this._ws.send('UnLock', { key: key });

    public unlockAll = () => this._ws.send('UnlockAll', { });
}
