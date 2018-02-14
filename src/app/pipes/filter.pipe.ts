import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter'
})

export class FilterPipe implements PipeTransform {
    transform(items: any[], term: string): any[] {
        if (!items) return [];
        if (!term) return items;

        term = term.toLowerCase();

        return items.filter(it => {
            return it.toLowerCase().includes(term);
        });
    }
}
