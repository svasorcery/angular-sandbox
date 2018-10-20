import { Directive, forwardRef } from '@angular/core';
import { AbstractControl, Validator, ValidatorFn, NG_VALIDATORS, ValidationErrors } from '@angular/forms';

export const base64: ValidatorFn = (control: AbstractControl): ValidationErrors =>
    /^(?:[A-Z0-9+\/]{4})*(?:[A-Z0-9+\/]{2}==|[A-Z0-9+\/]{3}=|[A-Z0-9+\/]{4})$/i.test(control.value) ? null : { 'base64': true };

@Directive({
    selector: '[base64][formControlName],[base64][formControl],[base64][ngModel]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => Base64Validator),
            multi: true
        }
    ]
})
export class Base64Validator implements Validator {
    validate(c: AbstractControl): ValidationErrors | null {
        return base64(c);
    }
}
