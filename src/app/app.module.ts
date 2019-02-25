import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCardModule, MatInputModule } from '@angular/material';

import { modules } from './modules';
import { components } from './components';
import { directives } from './directives';
import { validators } from './validators';
import { pipes } from './pipes';
import { services } from './services';
// import { functions } from './functions';

import { AppComponent } from './app.component';
import { WildCardTreeComponent } from './components/wildcard-tree.component';
import { ClipboardService } from './directives/clipboard.directive';
import { SortService } from './directives/sortable-table.directive';
// import { AuthorizationService, AccountService } from './directives/auth.directive';


export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        ReactiveFormsModule,
        HttpClientModule,
        DragDropModule,
        MatCardModule,
        MatInputModule,
       ...modules,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        RouterModule.forRoot([
            { path: '', component: AppComponent, pathMatch: 'full' },
            { path: '**', component: WildCardTreeComponent }
        ])
    ],
    declarations: [
        AppComponent,
        ...components,
        ...directives,
        ...validators,
        ...pipes
    ],
    providers: [
        ...services,
        ClipboardService,
        SortService,
        // AuthorizationService,
        // AccountService,
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {

}
