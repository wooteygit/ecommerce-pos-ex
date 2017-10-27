import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class MenuService {
    active: boolean = false;

    constructor(private router: Router) { }

    showMenu(): void {
        this.active = true;
    }

    hideMenu(): void {
        this.active = false;
    }
}