import { Pipe, PipeTransform } from '@angular/core';

import { ItemModel } from '../models/item.model';

@Pipe({
    name: 'itemFilter',
    pure: false
})
export class ItemFilterPipe implements PipeTransform {
    transform(items: ItemModel[], filter: string): any {
        if (!items || !filter) {
            return items;
        }

        return items.filter(o => {
            return new RegExp(filter, 'i').test(o.name);
        });
    }
}