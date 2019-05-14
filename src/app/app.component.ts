import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { ApiError, NotificationService } from './modules/errors';
import { LanguageService, Language } from './services/language.service';
import { RoutingStateService } from './services/routing-state.service';
import { PlatformService } from './services/platform.service';
import { RailStationsListSource, CountriesListSource } from './app.models';
import { ListItem } from './components/checkbox-list.component';
import { IPager } from './components/pager.component';
import { TreeBuilder, TreeItem } from './components/wildcard-tree.component';

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
        _platform: PlatformService,
        private _el: ElementRef,
        private _formBuilder: FormBuilder
    ) {
        this.langListSource = Language.all;
        this.railStatonsSource = new RailStationsListSource(http, this.railApiBaseUrl);
        this.countriesSource = new CountriesListSource(http, this.railApiBaseUrl);
        this._routingState.loadRouting();
        this.prevState = this._routingState.getPreviousUrl();

        this.myPlatform = _platform.isServer ? 'Server'
            : _platform.isBrowser ? 'Browser'
            : _platform.isIE ? 'IE'
            : _platform.isMobile ? 'Mobile'
            : 'unknown';
    }

    ngOnInit() {
        this.activateSpinner(3000);
        this._notification
            .notification$
            .subscribe(error => this.apiError = error);
        this.setHtmlLangAttribute();

        this.control = this._formBuilder.control('', Validators.required);
        this.componentErrorForm = this._formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            terms: ['', Validators.requiredTrue],
            address: this._formBuilder.group({
                city: ['', Validators.required],
                country: ['', Validators.required]
            })
        });
    }

    submit(form: any) {
        console.log(form.value);
    }

    /* platform */
    myPlatform: string = '';

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
        lang.value = this._lang.current.code.toLowerCase() || 'ru';
        const attrs = this._el.nativeElement.parentElement.parentElement.attributes;
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

    /* component-error */
    componentErrorForm: FormGroup;
    control: FormControl;
    customErrors = {required: 'Please accept the terms'}

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

    /* drag-drop */
    drop(event: CdkDragDrop<string[]>) {
        if (event.previousContainer !== event.container) {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex);
        } else {
            moveItemInArray(this.pizzasList, event.previousIndex, event.currentIndex);
        }
    }

    /* filter */
    filterTerm: string = '';

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

    /* carousel */
    public carouselSlides = [
        { title: 'Slide 1' },
        { title: 'Slide 2' },
        { title: 'Slide 3' },
    ];

    /* gravatar directive */
    email: string = 'sva.sorcery@gmail.com';

    /* wildcard-tree */
    treeData: TreeItem[] = new TreeBuilder()
        .group('Products')
            .group('Smartphones')
                .group('iOS')
                    .item('iPhone XS')
                    .item('iPhones X')
                    .item('iPhone 7s plus')
                    .item('iPhone 7s')
                    .item('iPhone 7 plus')
                    .item('iPhone 7')
                    .item('iPhone 6s plus')
                    .item('iPhone 6s')
                    .item('iPhone 6 plus')
                    .item('iPhone 6')
                    .up()
                .group('Android')
                    .group('Samsung')
                        .item('s10 plus')
                        .item('s10')
                        .item('s9 plus')
                        .item('s9 edge')
                        .item('s9')
                        .item('s8 plus')
                        .item('s8')
                        .up()
                    .up()
                .up()
            .up()
        .up()        
        .getData();

    /* map-google */
    map: {
        minClusterSize: 6,
        gridSize: 35,
        center: { lat: 55.751244, lng: 37.618423 },
        markers: [
            { coords: { lat: 55.752121, lng: 37.617664 } }
        ]
    }
}
