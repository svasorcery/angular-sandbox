import { AbstractControl, ValidatorFn } from '@angular/forms';

export class DateValidators {
    public static minValue(min: Date): ValidatorFn {
        min = new Date(min.getFullYear(), min.getMonth(), min.getDate());
        return (control: AbstractControl): { [key: string]: any } => {
            const value = <Date>control.value;
            return value && (value.getTime() < min.getTime()) ? { dateMinValue: true } : null;
        };
    }

    public static maxValue(max: Date): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            const value = <Date>control.value;
            return value && (value.getTime() > max.getTime()) ? { dateMaxValue: true } : null;
        };
    }
}
