import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiError } from './components/errors/errors.models';
import { NotificationService } from './components/errors/notification.service';
import { RoutingStateService } from './services/routing-state.service';
import { RailStationsListSource, CountriesListSource } from './app.models';
import { ListItem } from './components/checkbox-list.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    private railApiBaseUrl: string = 'http://localhost:55101';
    apiError: ApiError;

    /* previous routing state */
    prevState: string = '';

    constructor(
        http: HttpClient,
        private _notification: NotificationService,
        private _routingState: RoutingStateService
    ) {
        this.railStatonsSource = new RailStationsListSource(http, this.railApiBaseUrl);
        this.countriesSource = new CountriesListSource(http, this.railApiBaseUrl);
        this._routingState.loadRouting();
        this.prevState = this._routingState.getPreviousUrl();
    }

    ngOnInit() {
        this.activateSpinner(3000);
        this._notification
            .notification$
            .subscribe(error => this.apiError = error);
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
    pizzasList: ListItem[] = [
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
    ].map(p => { return { name: p } as ListItem });

    /* checkbox-list */
    selectedPizzaIndexes = [ 1, 3, 5 ];
    selectedPizzas: ListItem[] = [];

    /* toggle-switch */
    switchOn: boolean = true;

    /* clipboard */
    public logSuccess(value: string): void {
        console.group('Clipboard Success');
        console.log(value);
        console.groupEnd();
    }
    public logError(error: Error): void {
        console.group('Clipboard Error');
        console.error(error);
        console.groupEnd();
    }
}
