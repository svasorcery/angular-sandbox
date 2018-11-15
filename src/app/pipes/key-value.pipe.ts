import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'keyValue'
})
export class KeyValuePipe implements PipeTransform {
    transform(value: any, args?: any): { key: string, value: any }[] {
        const keys = [];
        for (const key in value) {
            if (value.hasOwnProperty(key)) {
                keys.push({ key: key, value: value[key] });
            }
        }
        return keys;
    }
}
