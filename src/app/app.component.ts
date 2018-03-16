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
        this.activateSpinner(3000);
    }

    submit(form: any) {
        console.log(form.value);
    }

    /* spinner */
    spinnerActive: boolean;
    activateSpinner(timeout: number = 5000) {
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

    /* error */
    error: boolean;

    /* modal */
    modal: boolean;
    modalContent: string;
    showModal() {
        this.modal = true;
        setTimeout(() => {
            this.modalContent = 'MODAL CONTENT LOADED';
            this.hideModal();
        }, 2000);
    }
    hideModal() {
        setTimeout(() => {
            this.modalContent = null;
            this.modal = false;
        }, 5000);
    }

    /* filter */
    filterTerm: string = '';
    pizzas: string[] = [
        'Alla Napoletana',
        'Marinara',
        'Pugliese',
        'Capricciosa',
        'Veronese',
        'Sicilian',
        'Quattro stagioni',
        'Ai Quattro Formagi',
        'Ai Funghi e Salsicce',
        'Italian Tuna',
        'Pomodoro Pachina and Rughetta',
        'Italian Calzones',
        'al taglio',
        'Sfincione',
        'Focaccia',
        'Focaccia Al Rosmarino',
        'Romana',
        'Liguria'
    ];

    /* toggle-switch */
    switchOn: boolean = true;
}
