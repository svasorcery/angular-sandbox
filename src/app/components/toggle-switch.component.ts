import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'toggle-switch',
    template: `
        <div class="switch">
            <input type="checkbox"
                [(ngModel)]="value"
                (change)="onChange()"
                [id]="name"
                [name]="name"
                class="switch-checkbox">
            <label class="switch-label" [for]="name">
                <span class="switch-inner"></span>
                <span class="toggle-switch"></span>
            </label>
        </div>
    `,
    styles: [`
        .switch {
            position: relative; width: 67px;
            -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none;
        }
        .switch-checkbox {
            display: none;
        }
        .switch-label {
            display: block; overflow: hidden; cursor: pointer;
            border: 2px solid #999999; border-radius: 0px;
        }
        .switch-inner {
            display: block; width: 200%; margin-left: -100%;
            transition: margin 0.3s ease-in 0s;
        }
        .switch-inner:before, .switch-inner:after {
            display: block; float: left; width: 50%; height: 22px; padding: 0; line-height: 18px;
            font-size: 10px; color: white; font-family: Trebuchet, Arial, sans-serif; font-weight: bold;
            box-sizing: border-box;
            border: 2px solid transparent;
            background-clip: padding-box;
        }
        .switch-inner:before {
            content: "ДА";
            padding-left: 7px;
            background-color: #EEEEEE; color: #337AB7;
        }
        .switch-inner:after {
            content: "НЕТ";
            padding-right: 7px;
            background-color: #EEEEEE; color: #999999;
            text-align: right;
        }
        .toggle-switch {
            display: block; width: 30px; margin: 0px;
            background: #80AFD9;
            position: absolute; top: 0; bottom: 0;
            right: 37px;
            transition: all 0.3s ease-in 0s;
        }
        .switch-checkbox:checked + .switch-label .switch-inner {
            margin-left: 0;
        }
        .switch-checkbox:checked + .switch-label .toggle-switch {
            right: 0px;
            background-color: #337AB7;
        }
    `],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ToggleSwitchComponent),
            multi: true,
        }
    ]
})

export class ToggleSwitchComponent implements ControlValueAccessor {
    @Input() name: string = 'switch';

    value?: boolean;

    constructor() { }

    public onChange() {
        this.propagateChange(this.value);
    }


    /* --- ControlValueAccessor -- */
    private propagateChange = (_: any) => { };
    writeValue = (obj: any) => this.value = obj;
    registerOnChange = (fn: any) => this.propagateChange = fn;
    registerOnTouched = (fn: any) => { };
    setDisabledState = (isDisabled: boolean) => { };
}
