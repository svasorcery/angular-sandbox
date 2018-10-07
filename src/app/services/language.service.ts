import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

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
            new Language('EN', 'English')
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

    constructor(
        private _storage: StorageService,
        private _translate: TranslateService
    ) {
        this._notification = new Subject();
        this.changed$ = this._notification.asObservable();

        _translate.setDefaultLang(Language.default.code.toLowerCase());

        const lang = _storage.contains('lang') ?
            _storage.retrieve<Language>('lang') :
            Language.default;

        this.setLanguage(lang);
    }

    public get current(): Language {
        const code = this._storage.retrieve<string>('lang');
        return !!code ? Language.byCode(code) : Language.default;
    }

    public change(lang: string | Language): void {
        this.setLanguage(lang);
        //window.location.reload();
    }

    public getTranslation = (key: string | string[]): Observable<string> =>
        this._translate.get(key)

    public setTranslation = (lang: string, translations: Object, shouldMerge?: boolean): void =>
        this._translate.setTranslation(lang, translations, shouldMerge)


    private setLanguage(lang: string | Language): void {
        if (!lang) { return; }
        const value = typeof(lang) === 'string' ? Language.byCode(lang) : lang as Language;
        if (!value) { return; }
        this._storage.store('lang', value.code);
        this._translate.use(value.code.toLowerCase());
        this.notify(value);
    }

    private notify = (lang: Language) => this._notification.next(lang);
}
