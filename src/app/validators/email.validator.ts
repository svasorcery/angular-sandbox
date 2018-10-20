import { Directive, forwardRef } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';

export const email: ValidatorFn = (control: AbstractControl): ValidationErrors => {
    if (!!Validators.required(control)) {
        return null;
    }
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(control.value) ? null : { 'email': true };
};


@Directive({
    selector: '[email][formControlName],[email][formControl],[email][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => EmailValidator), multi: true }
    ]
})
export class EmailValidator implements Validator {
    validate(c: AbstractControl): ValidationErrors {
        return email(c);
    }
}
