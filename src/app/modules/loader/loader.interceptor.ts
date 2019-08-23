import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, of } from "rxjs";
import { finalize, delay, catchError } from "rxjs/operators";

import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class LoaderInterceptorService implements HttpInterceptor {

  constructor(private _loaderService: LoaderService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.showLoader();
    return next.handle(req).pipe(
      delay(1000),
      finalize(() => this.hideLoader()),
      catchError(err => {
        this.hideLoader();
        return of(err.message ? err.message : err)
      })
    );
  }


  private showLoader = (): void => this._loaderService.show();

  private hideLoader = (): void => this._loaderService.hide();

}
