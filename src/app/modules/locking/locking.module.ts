import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LockingRoutingModule, lockingComponents } from './locking.routing';
import { LockingService } from './locking.service';

@NgModule({
    imports: [
        CommonModule,
        LockingRoutingModule
    ],
    declarations: [
        ...lockingComponents
    ],
    providers: [
        LockingService
    ],
    exports: [

    ],
})
export class LockingModule {

}
