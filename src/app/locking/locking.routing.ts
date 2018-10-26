import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LockingComponent } from './locking.component';


const routes: Routes = [
    {
        path: '',
        component: LockingComponent
    },
];


@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ],
})
export class LockingRoutingModule {

}


export const lockingComponents = [
    LockingComponent
];
