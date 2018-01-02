import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    constructor() { 
        
    }

    ngOnInit() {
        this.activateSpinner(5000);
    }

    /* spinner */
    spinnerActive: boolean;
    activateSpinner(timeout: number = 10000) {
        this.spinnerActive = true;
        setTimeout(() => {
            this.spinnerActive = false;
        }, timeout);
    }
}
