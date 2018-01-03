import { Http, URLSearchParams, Response } from '@angular/http';
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

    constructor(private http: Http, private baseUrl: string) { }

    search(term: string): Observable<{ name: string }[]> {
        let params = new URLSearchParams();
        params.set('term', term);
        return this.http.get(this.baseUrl + '/api/stations', { search: params })
            .map((response: Response) => response.json() as RailStation[]);
    }
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

    constructor(private http: Http, private baseUrl: string) { }

    search(term: string): Observable<{ name: string }[]> {
        let params = new URLSearchParams();
        params.set('term', term);
        return this.http.get(this.baseUrl + '/api/countries', { search: params })
            .map((response: Response) => (response.json() as { nameRu: string, nameEn: string, alpha2: string }[])
                .map(data => new Country(data.nameRu, data.nameEn, data.alpha2)));
    }
}
