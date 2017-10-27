import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MenuService } from '../../services/menu.service';
import { ItemService } from '../../services/item.service';
import { DBService } from '../../services/db.service';
import { DialogService } from '../../services/dialog.service';

import { ItemModel } from '../../models/item.model';
import { Statement } from '../../models/db.model';

@Component({
    selector: 'item-component',
    templateUrl: 'item.component.html',
    styleUrls: ['item.component.css'],
    host: { 'class': 'd-flex flex flex-column' }
})
export class ItemComponent implements OnInit {

    constructor(private router: Router, private dialog: DialogService, private menu: MenuService, private db: DBService, private itemService: ItemService) { }

    ngOnInit(): void {
    }
}
