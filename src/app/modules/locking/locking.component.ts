import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { LockedObject } from './locking.models';
import { LockingService } from './locking.service';

@Component({
    selector: 'locking-table',
    templateUrl: 'locking.component.html'
})
export class LockingComponent {
    items$: Observable<LockedObject[]>;

    constructor(private _locker: LockingService) {
        this.items$ = _locker.allLocked$;
        _locker.locked$.subscribe(_ => this.refresh());
        _locker.unlocked$.subscribe(_ => this.refresh());
        _locker.unlockedAll$.subscribe(_ => this.refresh());
        this.refresh();
    }

    public refresh = () => this._locker.list();

    public unlock = (item: LockedObject) => {
        if (!item) { return; }
        if (!confirm(`Снять блокировку ${item.key}?`)) { return; }
        this._locker.unlock(item.key);
    }

    public unlockAll = () => {
        if (!confirm(`Снять ВСЕ блокировки?`)) { return; }
        this._locker.unlockAll();
    }
}
