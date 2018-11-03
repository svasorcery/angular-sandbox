import { Directive, forwardRef } from '@angular/core';
import { AbstractControl, Validator, ValidatorFn, NG_VALIDATORS, ValidationErrors } from '@angular/forms';

export const digits: ValidatorFn = (control: AbstractControl): ValidationErrors =>
    /^\d+$/.test(control.value) ? null : { digits: true };

@Directive({
    selector: '[digits][formControlName],[digits][formControl],[digits][ngModel]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => DigitsValidator),
            multi: true
        }
    ]
})
export class DigitsValidator implements Validator {
    validate(c: AbstractControl): { [key: string]: any } {
        return digits(c);
    }
}

