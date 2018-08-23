import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';

// modules
import { ErrorsModule } from './components/errors/errors.module';

// components
import { SpinnerComponent } from './components/spinner.component';
import { ErrorComponent } from './components/error.component';
import { BreadcrumbComponent } from './components/breadcrumb.component';
import { AutoCompleteComponent } from './components/autocomplete.component';
import { TypeAheadComponent } from './components/typeahead.component';
import { DatePickerComponent } from './components/datepicker.component';
import { ModalComponent } from './components/modal.component';
import { PopoverContentComponent } from './components/popover.component';
import { ToggleSwitchComponent } from './components/toggle-switch.component';
import { CheckboxListComponent } from './components/checkbox-list.component';
import { FileUploadComponent } from './components/file-upload.component';
import { FileReadComponent } from './components/file-read.component';

// services
//import { AuthorizationService, AccountService } from './directives/auth.directive';
import { StorageService } from './services/storage.service';
import { LanguageService } from './services/language.service';
import { NotificationService } from './services/notification.service';

// directives
import { PopoverDirective } from './components/popover.component';
//import { DisableIfUnauthorizedDirective, HideIfUnauthorizedDirective } from './directives/auth.directive';
import { AutofocusDirective } from './directives/autofocus.directive';

// validation directives
import { DateRangeValidator } from './validators/date-range.validator';
import { CreditCardValidator } from './validators/credit-card-number.validator';

// pipes
import { FilterPipe } from './pipes/filter.pipe';
import { FileSizePipe } from './pipes/file-size.pipe';
import { SafePipe } from './pipes/safe.pipe';


export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        ErrorsModule,
        RouterModule
    ],
    declarations: [
        AppComponent,

        SpinnerComponent,
        ErrorComponent,
        BreadcrumbComponent,
        AutoCompleteComponent,
        TypeAheadComponent,
        DatePickerComponent,
        ModalComponent,
        PopoverContentComponent,
        ToggleSwitchComponent,
        CheckboxListComponent,
        FileUploadComponent,
        FileReadComponent,

        PopoverDirective,
        //DisableIfUnauthorizedDirective,
        //HideIfUnauthorizedDirective,
        AutofocusDirective,

        DateRangeValidator,
        CreditCardValidator,

        FilterPipe,
        FileSizePipe,
        SafePipe
    ],
    providers: [
        //AuthorizationService,
        //AccountService,
        StorageService,
        LanguageService,
        NotificationService
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {

}
