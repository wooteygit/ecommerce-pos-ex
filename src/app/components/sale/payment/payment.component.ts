import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { DialogService } from '../../../services/dialog.service';
import { OrderService } from '../../../services/order.service';

@Component({
    templateUrl: 'payment.component.html'
})
export class PaymentComponent {
    cash: number = null;

    constructor(private location: Location, private router: Router, private dialog: DialogService, private orderService: OrderService) {}

    confirm(): void {
        this.dialog.alert('Transaction is successful')
            .then(() => {
                this.orderService.clear();                
                this.router.navigate(['/sale']);
            });
    }

    tender(): void {
        this.cash = this.orderService.totalPrice;
    }

    cancel(): void {
        this.location.back();
    }
}
