import { Directive, Input } from '@angular/core';
import { Validator, ValidationErrors, FormGroup, NG_VALIDATORS } from '@angular/forms';

export function matchValue(firstControlName: string, secondControlName: string) {
  return (formGroup: FormGroup) => {
      const firstControl = formGroup.controls[firstControlName];
      const secondControl = formGroup.controls[secondControlName];

      if (!firstControl || !secondControl || !firstControl.value || !secondControl.value) {
        return null;
      } if (secondControl.errors && !secondControl.errors.matchValueError) {
        return null;
      } if (firstControl.value !== secondControl.value) {
          secondControl.setErrors({ matchValue: true });
      } else {
        secondControl.setErrors(null);
      }
  };

}


@Directive({
  selector: '[matchValue]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: MatchValueValidator, multi: true }
  ]
})
export class MatchValueValidator implements Validator {
  @Input('matchValue') matchValueFields: string[] = [];

  constructor() { }

  validate(formGroup: FormGroup): ValidationErrors {
    return matchValue(
      this.matchValueFields[0],
      this.matchValueFields[1]
    )(formGroup);
  }
}
