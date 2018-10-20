import { Directive, Input, OnInit, OnChanges, SimpleChanges, forwardRef } from '@angular/core';
import { AbstractControl, Validator, ValidatorFn, NG_VALIDATORS, ValidationErrors } from '@angular/forms';

const uuids = {
    '3': /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
    '4': /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
    '5': /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
    'all': /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i
};

export const uuid = (version?: string): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors => {
        const pattern = uuids[version] || uuids.all;
        return (new RegExp(pattern)).test(control.value) ? null : { uuid: true };
    };
};


@Directive({
    selector: '[uuid][formControlName],[uuid][formControl],[uuid][ngModel]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => UUIDValidator),
            multi: true
        }
    ]
})
export class UUIDValidator implements Validator, OnInit, OnChanges {
    @Input() uuid;

    private validator: ValidatorFn;
    private onChange: () => void;

    ngOnInit() {
        this.validator = uuid(this.uuid);
    }

    ngOnChanges(changes: SimpleChanges) {
        for (const key in changes) {
            if (key === 'uuid') {
                this.validator = uuid(changes[key].currentValue);
                if (this.onChange) {
                    this.onChange();
                }
            }
        }
    }

    validate(c: AbstractControl): { [key: string]: any } {
        return this.validator(c);
    }

    registerOnValidatorChange(fn: () => void): void {
        this.onChange = fn;
    }
}
