import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

// modules
import { ErrorsModule } from './components/errors/errors.module';

// components
import { SpinnerComponent } from './components/spinner.component';
import { ErrorComponent } from './components/error.component';
import { AutoCompleteComponent } from './components/autocomplete.component';
import { TypeAheadComponent } from './components/typeahead.component';
import { DatePickerComponent } from './components/datepicker.component';
import { ModalComponent } from './components/modal.component';
import { PopoverContentComponent } from './components/popover.component';
import { ToggleSwitchComponent } from './components/toggle-switch.component';
import { CheckboxListComponent } from './components/checkbox-list.component';

// directives
import { DateRangeValidationDirective } from './directives/date-range-validation.directive';
import { PopoverDirective } from './components/popover.component';

// pipes
import { FilterPipe } from './pipes/filter.pipe';

@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        HttpModule,
        RouterModule,
        ErrorsModule
    ],
    declarations: [
        AppComponent,
        
        SpinnerComponent,
        ErrorComponent,
        AutoCompleteComponent,
        TypeAheadComponent,
        DatePickerComponent,
        ModalComponent,
        PopoverContentComponent,
        ToggleSwitchComponent,
        CheckboxListComponent,

        PopoverDirective,
        DateRangeValidationDirective,

        FilterPipe
    ],
    providers: [

    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
