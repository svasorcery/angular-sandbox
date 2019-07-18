import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'count'
})
export class CountFormatPipe implements PipeTransform {
  transform = (amount: number, one: string, few: string, many: string, other: string): string =>
    `${ amount } ${amount === 1 ? one : (amount > 1 && amount <= 4) ? few : amount > 4 ? many : other}`;

}
