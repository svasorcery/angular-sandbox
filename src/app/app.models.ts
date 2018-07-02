import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { IAutoCompleteListSource } from './components/autocomplete.component';

export class RailStation {
    name: string;
    express: string;
    esr: string;
    location: Location;
}

class Location {
    country: string;
    region: string;
    railway: string;
    latitude: number;
    longitude: number;
}

export class RailStationsListSource implements IAutoCompleteListSource {
    constructor(private _http: HttpClient, private baseUrl: string) { }
    search = (term: string): Observable<{ name: string }[]> =>
        this._http.get<RailStation[]>(
            this.baseUrl + '/api/stations',
            { params: new HttpParams().set('term', term) }
        )
}


import { ITypeAheadListSource } from './components/typeahead.component';

export class Country {
    constructor(
        public name: string,
        public nameEn: string,
        public code: string
    ) { }
}

export class CountriesListSource implements ITypeAheadListSource {
    constructor(private _http: HttpClient, private baseUrl: string) { }
    search = (term: string): Observable<{ name: string }[]> =>
        this._http.get<{ nameRu: string, nameEn: string, alpha2: string }[]>(
            this.baseUrl + '/api/countries',
            { params: new HttpParams().set('term', term) }
        )
        .map(countries => countries.map(c => new Country(c.nameRu, c.nameEn, c.alpha2)))
}
