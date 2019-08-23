import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
// import { MatProgressSpinnerModule } from '@angular/material';

import { LoaderInterceptorService } from './loader.interceptor';
import { LoaderComponent } from './loader.component';

@NgModule({
  imports: [
    CommonModule,
    // MatProgressSpinnerModule
  ],
  declarations: [
    LoaderComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptorService,
      multi: true
    }
  ],
  exports: [
    LoaderComponent
  ],
})
export class LoaderModule { }
