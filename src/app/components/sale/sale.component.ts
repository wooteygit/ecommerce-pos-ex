import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { MenuService } from '../../services/menu.service';
import { WindowService } from '../../services/window.service';
import { ItemService } from '../../services/item.service';
import { OrderService } from '../../services/order.service';
import { DialogService } from '../../services/dialog.service';

import { ItemModel } from '../../models/item.model';

@Component({
    selector: 'sale-component',
    templateUrl: 'sale.component.html',
    styleUrls: ['sale.component.css'],
    host: { 'class': 'd-flex flex flex-column' }
})
export class SaleComponent implements OnInit {
    gridMode: boolean = true;
    listMode: boolean = false;
    numpadMode: boolean = false;
    isBill: boolean = false;
    barcode: string = "";
    query: string = "";
    itemLoading: boolean = false;
    itemPerPage: number = 25;

    itemData: ItemModel[] = [];

    gridItems: any[] = [];
    gridIndex: number = 0;
    gridMenus: any[] = [];
    images: string[] = [];

    constructor(private router: Router, private dialog: DialogService, private menu: MenuService, private window: WindowService, private itemService: ItemService, private orderService: OrderService) { }

    ngOnInit(): void {
        this.showList();

        this.itemLoading = true;
        this.itemService.find().then(data => {
            this.itemData = data;
            this.itemLoading = false;

            let pageCount: number = Math.ceil(this.itemData.length / this.itemPerPage);
            if (pageCount > 0) {
                for (let i = 0; i < pageCount; i++) {
                    this.gridMenus.push({
                        index: i
                    });
                }
                this.gridMenus[0].active = true;
                this.renderGrid();
            }
        });
    }

    renderGrid(): void {     
        let start: number = this.gridIndex * this.itemPerPage;  
        let end: number = start + this.itemPerPage;
        
        this.gridItems = [];
        for (let i = 0; i < 5; i++) {
            let item: any = {
                items: []
            };
            for (let j = 0; j < 5; j++) {
                if (start < this.itemData.length && start < end) {
                    item.items.push(this.itemData[start]);
                    start++;
                }
                else {
                    item.items.push({});
                }
            }
            this.gridItems.push(item);
        }
    }

    showBill(): void {
        this.isBill = true;
    }

    hideBill(): void {
        this.isBill = false;
    }

    clearBill(): void {
        this.dialog.confirm('Are you sure you want to clear this bill?')
            .then(res => {
                if (res) {
                    this.orderService.clear();
                    this.hideBill();
                }
            });
    }

    clearPageNav(): void {
        for (let i of this.gridMenus) {
            i.active = false;
        }

        this.gridMode = false;
        this.numpadMode = false;
        this.listMode = false;
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        if (event.target.innerWidth <= 599) {
            this.listMode = true;
            this.gridMode = false;
        }
    }

    @HostListener('window:keypress', ['$event'])
    onKeypress(event) {
        if (!/^(INPUT|SELECT|BUTTON)$/i.test(event.target.tagName)) {
            if (event.which != 13) {
                this.barcode += String.fromCharCode(event.which);
            }
            else {
                console.log(this.barcode);
                
                // let item: ItemModel = this.itemData.find((item: ItemModel) => { 
                //     return item.barcode == this.barcode; 
                // });
                // if (item) {
                //     this.orderService.add(item);
                // }
                // this.barcode = "";

                this.itemService.find({ barcode: this.barcode })
                    .then(data => {
                        if (data.length) {
                            this.orderService.add(data[0]);
                        }
                        this.barcode = "";
                    });
            }
        }
    }

    showGrid(index: number): void {
        this.clearPageNav();
        this.gridMode = true;

        if (!index) {
            index = 0;
        }
        this.gridMenus[index].active = true;
        this.gridIndex = index;
        this.renderGrid();
    }

    showList(): void {
        this.clearPageNav();
        this.listMode = true;
    }

    charge(): void {
        if (this.orderService.totalPrice > 0) {
            this.router.navigate(['/sale/payment']);
        }
    }
}