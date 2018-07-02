import { Directive, ElementRef, OnInit, Input, Injectable } from '@angular/core';

@Directive({
    selector: '[disableIfUnauthorized]'
})
export class DisableIfUnauthorizedDirective implements OnInit {
    @Input('disableIfUnauthorized') permission: AuthGroup; // Required permission passed in

    constructor(private el: ElementRef, private _auth: AuthorizationService) { }

    ngOnInit() {
        if (!this._auth.hasPermission(this.permission)) {
            this.el.nativeElement.disabled = true;
        }
    }
}

@Directive({
    selector: '[hideIfUnauthorized]'
})
export class HideIfUnauthorizedDirective implements OnInit {
    @Input('hideIfUnauthorized') permission: AuthGroup; // Required permission passed in

    constructor(private el: ElementRef, private _auth: AuthorizationService) { }

    ngOnInit() {
        if (!this._auth.hasPermission(this.permission)) {
            this.el.nativeElement.style.display = 'none';
        }
    }
}


@Injectable()
export class AuthorizationService {
    permissions: string[];

    constructor(private _account: AccountService) { }

    hasPermission(authGroup: AuthGroup): boolean {
        if (!this.permissions) {
            this.initializePermissions();
        }
        return this.permissions && !!this.permissions.find(permission => permission === authGroup);
    }

    // This method is called once and a list of permissions is stored in the permissions property
    initializePermissions(): string[] {
        return this.permissions = this._account.getPermissions();
    }
}


@Injectable()
export class AccountService {
    public getPermissions(): string[] {
        return [ 'UPDATE_ALL_ACCESS' ]; // temporary!
    }
}


export type AuthGroup = 'UPDATE_ALL_ACCESS' | 'READ_ONLY_ACCESS';
