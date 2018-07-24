import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { StorageService } from './storage.service';

export class Language {
    public imageUri: string;

    constructor(
        public code: string,
        public name: string
    ) {
        this.imageUri = `../../assets/img/flags/${code.toLowerCase()}.png`;
    }

    public static get all(): Language[] {
        return [
            new Language('RU', 'Русский'),
            new Language('EN', 'English'),
            new Language('DE', 'Deutsche')
        ];
    }

    public static get default(): Language {
        return Language.byCode('RU');
    }

    public static byCode = (code: string): Language =>
        Language.all.find(x => x.code === code)
}


@Injectable()
export class LanguageService {
    private _notification: Subject<Language>;
    readonly changed$: Observable<Language>;

    constructor(private _storage: StorageService) {
        this._notification = new Subject();
        this.changed$ = this._notification.asObservable();

        const lang = this._storage.contains('lang') ?
            _storage.retrieve<Language>('lang') :
            Language.default;

        this.change(lang);
    }

    public get current(): Language {
        const code = this._storage.retrieve<string>('lang');
        return !!code ? Language.byCode(code) : Language.default;
    }

    public change(lang: string | Language): void {
        if (!lang) { return; }
        const value = typeof(lang) === 'string' ? Language.byCode(lang) : lang as Language;
        if (!value) { return; }
        this._storage.store('lang', value.code);
        this.notify(value);
    }

    private notify = (lang: Language) => this._notification.next(lang);
}
