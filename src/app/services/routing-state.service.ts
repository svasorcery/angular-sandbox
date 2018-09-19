import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable()
export class RoutingStateService {
    private history: string[] = [];

    constructor(
        private _router: Router
    ) { }

    public loadRouting = () =>
        this._router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(({ urlAfterRedirects }: NavigationEnd) =>
                this.history = [...this.history, urlAfterRedirects]
            )

    public getHistory = (): string[] => this.history;

    public getPreviousUrl = (): string => this.history[this.history.length - 2] || '/';
}
