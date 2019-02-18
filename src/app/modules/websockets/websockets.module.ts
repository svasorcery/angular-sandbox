import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebSocketsService } from './websockets.service';
import { WebSocketsConfig } from './websockets.interfaces';
import { config } from './websockets.config';


@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [],
    providers: [
        WebSocketsService
    ]
})
export class WebSocketsModule {
    public static config(wsConfig: WebSocketsConfig): ModuleWithProviders {
        return {
            ngModule: WebSocketsModule,
            providers: [
                { provide: config, useValue: wsConfig }
            ]
        };
    }
}
