import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { SpinnerComponent } from './components/spinner.component';


@NgModule({
    imports: [
        BrowserModule,
        CommonModule
    ],
    declarations: [
        AppComponent,
        SpinnerComponent
    ],
    providers: [

    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
