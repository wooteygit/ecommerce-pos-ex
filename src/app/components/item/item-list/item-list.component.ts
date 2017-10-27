import { Component, OnInit, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { ItemService } from '../../../services/item.service';
import { DialogService } from '../../../services/dialog.service';
import { ItemModel } from '../../../models/item.model';

import { Config } from '../../../../environments/environment';

@Component({
    selector: 'app-item-list',
    templateUrl: './item-list.component.html',
    styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
    itemData: ItemModel[] = [];
    page: number = 1;
    barcode: string = "";

    constructor(private router: Router, private location: Location, private itemService: ItemService, private dialogService: DialogService) { }

    ngOnInit() {
        this.fetch(this.page);
    }

    @HostListener('window:keypress', ['$event'])
    onKeypress(event) {
        if (!/^(INPUT|SELECT|BUTTON)$/i.test(event.target.tagName)) {
            if (event.which != 13) {
                this.barcode += String.fromCharCode(event.which);
            }
            else {
                console.log(this.barcode);
                if (this.barcode == "123") {
                    this.itemService.matching().then(data => {
                        this.itemData.splice(0, 0, data);
                        this.barcode = "";    
                    });
                }
                else {
                    this.barcode = "";
                    this.dialogService.alert("Item not found.");
                }
            }
        }
    }

    back(): void {
        this.location.back();
    }

    add(): void {
        this.router.navigate(["/item/list/new"]);
    }

    fetch(page: number): void {
        if (this.page > 0) {
            this.itemService.find({}, { page: page }).then((data: ItemModel[]) => {
                this.itemData = this.itemData.concat(data);

                if (data.length < Config.PageSize) {
                    this.page = 0;
                }
                else {
                    this.page = page;
                }
            });
        }
    }
}
