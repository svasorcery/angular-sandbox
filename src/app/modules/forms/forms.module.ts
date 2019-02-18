import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SimpleFormComponent } from './simple-form.component';
import { ControlMessagesComponent } from './control-messages.component';

@NgModule({
    imports: [
        FormsModule,
        CommonModule
    ],
    declarations: [
        SimpleFormComponent,
        ControlMessagesComponent
    ],
    providers: [

    ],
    exports: [
        SimpleFormComponent,
        ControlMessagesComponent,
        FormsModule
    ],
})
export class FormsExtendedModule { }
