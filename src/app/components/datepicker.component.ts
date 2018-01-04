import {
    Component, Input, HostListener, AfterViewInit, OnDestroy,
    SimpleChanges, OnChanges, HostBinding, forwardRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as jQuery from 'jquery';
import 'bootstrap-datepicker';

(function ($) {
    $.fn.datepicker.dates['ru'] = {
        days: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
        daysShort: ["Вск", "Пнд", "Втр", "Срд", "Чтв", "Птн", "Суб"],
        daysMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
        months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
        monthsShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
        today: "Сегодня",
        clear: "Очистить",
        format: "dd.mm.yyyy",
        weekStart: 1
    };
}(jQuery));


@Component({
    selector: 'date-picker',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DatePickerComponent),
            multi: true
        }
    ],
    template: `
        <div class="form-inline ng2-datetime">
            <div class="form-group date">
                <input id="{{idDatePicker}}" type="text" class="form-control"
                       [attr.readonly]="readonly"
                       [attr.required]="required"
                       [attr.placeholder]="datepickerOptions.placeholder || 'Выберите дату'"
                       [attr.tabindex]="tabindex"
                       [(ngModel)]="dateModel"
                       (blur)="onTouched()"
                       (keyup)="checkEmptyValue($event)"/>
            </div>
            <button *ngIf="hasClearButton" type="button" (click)="clearModels()">Clear</button>
        </div>
    `,
    styles: [
        '.ng2-datetime *[hidden] { display: none; }'
    ]
})
export class DatePickerComponent implements ControlValueAccessor, AfterViewInit, OnDestroy, OnChanges {
    @Input('datepicker') datepickerOptions: any = {};
    @Input('start') start: Date;
    @Input('hasClearButton') hasClearButton: boolean;
    @Input() readonly: boolean;
    @Input() required: boolean;
    @Input() tabindex: string;

    date: Date; // ngModel
    dateModel: string;
    timeModel: string = "0";

    // instances
    datepicker: any;

    idDatePicker: string = uniqueId('q-datepicker_');

    onChange = (_: any) => {

    }

    @HostListener('blur')
    onTouched = () => {

    }

    @HostBinding('attr.tabindex')
    get tabindexAttr(): string | undefined {
        return this.tabindex === undefined ? '-1' : undefined;
    }

    ngAfterViewInit() {
        this.init();
    }

    ngOnDestroy() {
        if (this.datepicker) {
            this.datepicker.datepicker('destroy');
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes) {
            if (changes['start'] && this.datepicker) {
                this.datepicker.datepicker('setStartDate', this.start);
                if (this.date < this.start) {
                    this.writeValue(this.start);
                }
            }
            if (changes['datepickerOptions'] && this.datepicker) {

                this.datepicker.datepicker('destroy');

                if (changes['datepickerOptions'].currentValue) {
                    this.datepicker = null;
                    this.init();
                } else if (changes['datepickerOptions'].currentValue === false) {
                    this.datepicker.remove();
                }
            }
        }
    }

    writeValue(value: any) {
        if (value) {
            if (isString(value)) {
                this.date = new Date(value);
            }
            else if (isDate(value)) {
                this.date = value;
            }
            else {
                this.clearModels();
                return;
            }

            setTimeout(() => {
                this.updateModel(this.date);
            }, 0);

            return;
        }
        this.clearModels();
    }

    registerOnChange(fn: (_: any) => void) {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void) {
        this.onTouched = fn;
    }

    updateTime(e: any) {
        const value = parseInt(e.target.value);
        const hours = value / 60;

        if (!isDate(this.date)) {
            this.date = new Date();
            this.updateDatepicker(this.date);
        }

        this.date.setHours(hours);
        this.date.setMinutes(0);
        this.date.setSeconds(0);
        this.onChange(this.date);
    }

    checkEmptyValue(e: any) {
        const value = e.target.value;
        if (value === '') {
            this.onChange(undefined);
        }
    }

    clearModels() {
        this.onChange(undefined);
        this.updateDatepicker(null);
    }

    showTimepicker() {

    }

    showDatepicker() {
        this.datepicker.datepicker('show');
    }


    private init(): void {
        if (!this.datepicker && this.datepickerOptions !== false) {
            let options = jQuery.extend({
                enableOnReadonly: !this.readonly,
                startDate: this.start,
                language: 'ru',
                autoclose: true
            }, this.datepickerOptions);
            this.datepicker = (jQuery('#' + this.idDatePicker)).datepicker(options);
            this.datepicker
                .on('changeDate', (e: any) => {
                    let newDate: Date = e.date;

                    if (isDate(this.date) && isDate(newDate)) {
                        // get hours/minutes
                        newDate.setHours(this.date.getHours());
                        newDate.setMinutes(this.date.getMinutes());
                        newDate.setSeconds(this.date.getSeconds());
                    }

                    this.date = newDate;
                    this.onChange(newDate);
                });
        } else if (this.datepickerOptions === false) {
            (jQuery('#' + this.idDatePicker)).remove();
        }

        this.updateModel(this.date);
    }

    private updateModel(date: Date): void {
        this.updateDatepicker(date);
    }

    private updateDatepicker(date?: any) {
        if (this.datepicker !== undefined) {
            this.datepicker.datepicker('update', date);
        }
    }

    private pad(value: any): string {
        return value.toString().length < 2 ? '0' + value : value.toString();
    }
}

let id = 0;
function uniqueId(prefix: string): string {
    return prefix + ++id;
}

function isDate(obj: any) {
    return Object.prototype.toString.call(obj) === '[object Date]';
}

function isString(obj: any) {
    return Object.prototype.toString.call(obj) === '[object String]';
}
