import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter'
})

export class FilterPipe implements PipeTransform {
    transform(items: { name: string }[], term: string): any[] {
        if (!items) return [];
        if (!term) return items;

        term = term.toLowerCase();

        return items.filter(i => {
            return i.name.toLowerCase().includes(term);
        });
    }
}
