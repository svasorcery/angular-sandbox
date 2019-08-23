import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { LoaderState } from './loader';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  public loaderState$: Observable<LoaderState>;
  private _loaderState$: BehaviorSubject<LoaderState>;

  constructor() {
    this._loaderState$ = new BehaviorSubject({ show: false });
    this.loaderState$ = this._loaderState$.asObservable();
  }

  show = () => this._loaderState$.next({ show: true } as LoaderState);
  hide = () => this._loaderState$.next({ show: false } as LoaderState);

}
