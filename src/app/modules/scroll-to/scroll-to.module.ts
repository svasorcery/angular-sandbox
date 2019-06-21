import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScrollToDirective } from './scroll-to.directive';
import { ScrollToService } from './scroll-to.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ScrollToDirective
  ],
  providers: [
    ScrollToService
  ],
  exports: [
    ScrollToDirective
  ]
})
export class ScrollToModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ScrollToModule
    };
  }
}
