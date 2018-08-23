import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationEnd, PRIMARY_OUTLET } from '@angular/router';
import { filter } from 'rxjs/operators';

interface IBreadcrumb {
    label: string;
    params?: Params;
    url: string;
}


@Component({
    selector: 'breadcrumb',
    template: `
        <div class="breadcrumbs__wrapper">
            <ul class="breadcrumbs__list">
                <li>
                    <a routerLink="/">Home</a>
                </li>
                <li *ngFor="let bc of breadcrumbs">
                    <a [routerLink]="[bc.url]">{{ bc.label }}</a>
                </li>
            </ul>
        </div>
    `,
    styles: [`
        .breadcrumbs {
            width: 100%;
            background: #37474F;
        }
        .breadcrumbs__wrapper {
            width: unset;
            margin: 0 auto;
            padding: 11px 15px;
            font-size: 0;
        }
        @media only screen and (min-width: 1300px) {
            .breadcrumbs__wrapper {
                width: 1260px;
                padding: 11px 0px;
            }
        }
        .breadcrumbs__list {
            display: inline-block;
        }
        .breadcrumbs__list li {
            position: relative;
            display: inline-block;
            padding: 3px 20px;
        }
        @media only screen and (min-width: 480px) {
            .breadcrumbs__list li {
                padding: 0px 20px;
            }
        }
        .breadcrumbs__list li a {
            display: inline-block;
            font-family: "Lato-Regular";
            font-size: 10px;
            line-height: 21px;
            color: #ffffff;
            cursor: pointer;
            vertical-align: middle;
        }
        .breadcrumbs__list>li>a>span {
            border-bottom: 1px solid;
        }
        .breadcrumbs__list>li>a>span:hover {
            border-bottom: 0;
        }
        @media only screen and (min-width: 768px) {
            .breadcrumbs__list li a {
                font-size: 14px;
                line-height: 24px;
            }
        }
        .breadcrumbs__list li::before {
            position: absolute;
            content: "";
            right: 0px;
            top: 0px;
            width: 7px;
            height: 19px;
            background: url(../../assets/img/group495.png) center center no-repeat;
        }
        .breadcrumbs__list li:first-child {
            padding-left: 0px;
        }
        .breadcrumbs__list li:last-child::before {
            position: absolute;
            content: "";
            right: 0px;
            top: 0px;
            width: 0px;
            height: 0px;
            background: none;
        }
    `]
})
export class BreadcrumbComponent implements OnInit {
    @Input() visible: boolean = true;
    public breadcrumbs: IBreadcrumb[];

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
        this.breadcrumbs = [];
    }

    ngOnInit() {
        // subscribe to the NavigationEnd event
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(event => {
                // set breadcrumbs
                const root: ActivatedRoute = this.activatedRoute.root;
                this.breadcrumbs = this.getBreadcrumbs(root);
            });
    }

    private getBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: IBreadcrumb[] = []): IBreadcrumb[] {
        const ROUTE_DATA_BREADCRUMB: string = 'breadcrumb';
        const ROUTE_DATA_BREADCRUMB_KEY: string = 'key';
        const ROUTE_DATA_BREADCRUMB_VALUES: string = 'values';

        // get the child routes
        const children: ActivatedRoute[] = route.children;

        // return if there are no more children
        if (children.length === 0) {
            return breadcrumbs;
        }

        // iterate over each children
        for (const child of children) {
            // verify primary route
            if (child.outlet !== PRIMARY_OUTLET) {
                continue;
            }

            // verify the custom data property "breadcrumb" is specified on the route
            if (!child.snapshot.data.hasOwnProperty(ROUTE_DATA_BREADCRUMB)) {
                return this.getBreadcrumbs(child, url, breadcrumbs);
            }

            // get the route's URL segment
            const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');

            if (!routeURL || routeURL === '') {
                continue;
            }

            // append route URL to URL
            url += `/${routeURL}`;

            const key = child.snapshot.data[ROUTE_DATA_BREADCRUMB][ROUTE_DATA_BREADCRUMB_KEY];
            const values = child.snapshot.data[ROUTE_DATA_BREADCRUMB][ROUTE_DATA_BREADCRUMB_VALUES];
            const label = values.map(value => child.snapshot.data[key][value]).join(' ');

            // add breadcrumb
            const breadcrumb: IBreadcrumb = {
                label: label,
                params: child.snapshot.params,
                url: url
            };

            breadcrumbs.push(breadcrumb);

            // recursive
            return this.getBreadcrumbs(child, url, breadcrumbs);
        }

        // we should never get here, but just in case
        return breadcrumbs;
    }
}
