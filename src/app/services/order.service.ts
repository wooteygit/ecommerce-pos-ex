import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { DBService } from './db.service';

import { OrderItemModel } from '../models/order-item.model';
import { ItemModel } from '../models/item.model';

@Injectable()
export class OrderService {
    data: OrderItemModel[] = [];
    totalQty: number = 0;
    totalPrice: number = 0;

    constructor(private http: HttpClient, private db: DBService) {
    }

    private sum(): void {
        let qty: number = 0;
        let price: number = 0;
        for (let i of this.data) {
            price += (i.qty * i.item.price);
            qty += i.qty;
        }
        this.totalPrice = price;
        this.totalQty = qty;
    }

    clear(): void {
        this.data = [];
        this.totalQty = 0;
        this.totalPrice = 0;
    }

    add(item: ItemModel): void {
        if (this.data.length > 0 && this.data[this.data.length - 1].item.id == item.id) {
            this.data[this.data.length - 1].qty++;
        }
        else {
            this.data.push({
                qty: 1,
                item: item
            });
        }

        this.sum();
    }
}