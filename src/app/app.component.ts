import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

import { RailStationsListSource, CountriesListSource } from './app.models';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    private railApiBaseUrl: string = 'http://localhost:55101';

    constructor(http: Http) { 
        this.railStatonsSource = new RailStationsListSource(http, this.railApiBaseUrl);
        this.countriesSource = new CountriesListSource(http, this.railApiBaseUrl);
    }

    ngOnInit() {
        this.activateSpinner(5000);
    }

    /* spinner */
    spinnerActive: boolean;
    activateSpinner(timeout: number = 10000) {
        this.spinnerActive = true;
        setTimeout(() => {
            this.spinnerActive = false;
        }, timeout);
    }

    /* autocomplete */
    railStatonsSource: RailStationsListSource;
    railStation: string;

    /* typeahead */
    countriesSource: CountriesListSource;
    country: string;

    /* date-picker */
    birthDate: Date;
}
