import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'weight'})
export class WeightPipe implements PipeTransform {
    private units = [
        'gr',
        'kg',
        'tonns'
    ];

    transform(grams: number = 0): string {
        if (isNaN(parseFloat(grams.toString())) || ! isFinite(grams)) { return '?'; }

        let unit = 0;

        while (grams >= 1000) {
            grams /= 1000;
            unit ++;
        }

        return `${grams} ${this.units[unit]}`;
    }
}
