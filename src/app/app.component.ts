import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiError, NotificationService } from './errors';
import { LanguageService, Language } from './services/language.service';
import { RoutingStateService } from './services/routing-state.service';
import { RailStationsListSource, CountriesListSource } from './app.models';
import { ListItem } from './components/checkbox-list.component';
import { IPager } from './components/pager.component';

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
        private _lang: LanguageService,
        private _notification: NotificationService,
        private _routingState: RoutingStateService,
        private _el: ElementRef
    ) {
        this.langListSource = Language.all;
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
        this.setHtmlLangAttribute();
    }

    submit(form: any) {
        console.log(form.value);
    }

    /* language */
    langListSource: Language[];
    public get currentLang(): Language {
        return this._lang.current;
    }
    public changeLang = (code: string) => {
        if (!code) { return; }
        this._lang.change(code);
    }
    public toggleLang = () => this._lang.current.code === 'RU' ? this.changeLang('EN') : this.changeLang('RU');
    public setHtmlLangAttribute = () => {
        /* set html lang attribute (Chrome auto-translate issue) */
        const lang = document.createAttribute('lang');
        lang.value = _lang.current.code.toLowerCase() || 'ru';
        const attrs = _el.nativeElement.parentElement.parentElement.attributes;
        if (attrs) { attrs.setNamedItem(lang); }
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

    /* status-indicator */
    status: 'success' | 'warning' | 'danger' = null;
    statusPulse: boolean = true;
    toggleStatus = (): void => {
        switch (this.status) {
            case 'success': this.status = 'warning'; break;
            case 'warning': this.status = 'danger'; break;
            case 'danger': this.status = 'success'; break;
            default: this.status = 'success'; break;
        }
    }
    toggleStatusPulse = () => this.statusPulse = !this.statusPulse;

    /* pagination */
    paginationInfo: IPager = { itemsPage: 10, totalItems: 100, actualPage: 1, totalPages: 10, items: 10 };
    public onPageChanged(page: any): any {
        this.paginationInfo.actualPage = page;
        // http-request here
        console.log(page);
    }
}
