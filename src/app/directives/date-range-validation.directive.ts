import { Directive, OnInit, Input, forwardRef } from '@angular/core';
import { AbstractControl, Validator, NG_VALIDATORS, ValidationErrors } from '@angular/forms';

@Directive({
    selector: '[validateDateRange]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => DateRangeValidationDirective), multi: true }
    ]
})
export class DateRangeValidationDirective implements Validator, OnInit {
    @Input('validateDateRange') options: any = {};

    public required: boolean;
    public min: Date;
    public max: Date;

    private minDefault: Date = CalculateDate.addYearsFromToday(-150);
    private maxDefault: Date = CalculateDate.addDaysFromToday(-1)

    constructor() { }

    ngOnInit() {
        this.required = this.options.required || false;
        this.min = this.options.min ? new Date(Date.parse(this.options.min)) : this.minDefault;
        this.max = this.options.max ? new Date(Date.parse(this.options.max)) : this.maxDefault;
    }

    validate(c: AbstractControl): ValidationErrors | null {

        if (this.required && !c.value) {
            return {
                required: false,
                message: 'Выберите дату.'
            }
        }

        if (c.value && (c.value.getTime() < this.min.getTime())) {
            return {
                dateMinValue: false,
                message: 'Дата недействительна.',
                min: this.min
            };
        }

        if (c.value && (c.value.getTime() > this.max.getTime())) {
            return {
                dateMaxValue: false,
                message: 'Дата превышает максимальное значение.',
                max: this.max
            };
        }
    }
}

export class CalculateDate {
    public static addDaysFromToday(count: number): Date {
        var today = new Date();
        return new Date(today.setDate(today.getDate() + count));
    }

    public static addMonthsFromToday(count: number): Date {
        var today = new Date();
        return new Date(today.setMonth(today.getMonth() + count));
    }

    public static addYearsFromToday(count: number): Date {
        var today = new Date();
        return new Date(today.setFullYear(today.getFullYear() + count));
    }
} 
