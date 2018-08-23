import { Directive } from '@angular/core';
import { FormControl, Validator, ValidationErrors, NG_VALIDATORS } from '@angular/forms';

@Directive({
    selector: '[validCreditCard]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: CreditCardValidator, multi: true }
    ]
})
export class CreditCardValidator implements Validator {
    static validateCcNumber(control: FormControl): ValidationErrors {
        if (!(control.value.startsWith('4') || control.value.startsWith('5'))
        ) {
            // Return error if card is not Amex, Visa or Mastercard
            return { creditCard: 'Your credit card number is not from a supported credit card provider' };
        } else if (control.value.length !== 16) {
            // Return error if length is not 16 digits
            return { creditCard: 'A credit card number must be 16-digit long' };
        }
        // If no error, return null
        return null;
    }

    public validate(c: FormControl): ValidationErrors | null {
        return CreditCardValidator.validateCcNumber(c);
    }
}
