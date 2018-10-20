import { Directive, forwardRef } from '@angular/core';
import { AbstractControl, Validator, ValidatorFn, NG_VALIDATORS, ValidationErrors } from '@angular/forms';

export const json: ValidatorFn = (control: AbstractControl): ValidationErrors => {
    try {
        const obj = JSON.parse(control.value);

        if (!!obj && typeof obj === 'object') {
            return null;
        }
    } catch (e) {

    }
    return { json: true };
};


@Directive({
    selector: '[json][formControlName],[json][formControl],[json][ngModel]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => JsonValidator),
            multi: true
        }
    ]
})
export class JsonValidator implements Validator {
    validate(c: AbstractControl): ValidationErrors {
        return json(c);
    }
}
