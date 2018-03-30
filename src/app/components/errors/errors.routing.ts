import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErrorsComponent } from './errors.component';

const errorRoutes: Routes = [
    { path: 'error', component: ErrorsComponent },
];

@NgModule({
    imports: [RouterModule.forChild(errorRoutes)],
    exports: [RouterModule]
})
export class ErrorRoutingModule { 

}
