import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { ControlErrorDirective } from './control-error.directive';
import { ControlErrorComponent } from './control-error.component';
import { ControlErrorContainerDirective } from './control-error-container.directive';
import { FormSubmitDirective } from './form-submit.directive';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule
    ],
    declarations: [
        ControlErrorDirective,
        ControlErrorComponent,
        ControlErrorContainerDirective,
        FormSubmitDirective
    ],
    entryComponents: [
        ControlErrorComponent
    ],
    exports: [
        ControlErrorDirective,
        ControlErrorComponent,
        ControlErrorContainerDirective,
        FormSubmitDirective
    ]
})
export class ControlErrorModule { }
