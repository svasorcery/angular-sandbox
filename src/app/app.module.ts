import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { SpinnerComponent } from './components/spinner.component';
import { AutoCompleteComponent } from './components/autocomplete.component';
import { TypeAheadComponent } from './components/typeahead.component';

@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        HttpModule
    ],
    declarations: [
        AppComponent,
        SpinnerComponent,
        AutoCompleteComponent,
        TypeAheadComponent
    ],
    providers: [

    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
