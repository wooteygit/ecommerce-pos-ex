import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { ItemService } from '../../../../services/item.service';

@Component({
    templateUrl: 'item-form.component.html'
})
export class ItemFormComponent implements OnInit {
    constructor(private location: Location, private itemService: ItemService) {}

    ngOnInit() {

    }
}
