import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { DBService } from '../services/db.service';
import { MenuService } from '../services/menu.service';
import { AuthenService } from '../services/authen.service';
import { GlobalService } from '../services/global.service';
import { ItemService } from '../services/item.service';
import { StorageService } from '../services/storage.service';

import { environment, Config } from '../../environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css']
})
export class AppComponent implements OnInit {

    constructor(public global: GlobalService, private title: Title, private authen: AuthenService) { }

    ngOnInit(): void {
        this.authen.load();
        this.title.setTitle(Config.AppName);
    }
}

@Component({
    templateUrl: 'app-layout.component.html',
    styleUrls: ['app.component.css']
})
export class AppLayoutComponent implements OnInit {
    env: any = environment;

    constructor(public global: GlobalService, private storage: StorageService, private router: Router,
        public authen: AuthenService, private menu: MenuService, private db: DBService,
        private itemService: ItemService) { }

    ngOnInit(): void {
        if (!this.storage.get('db_sync')) {
            this.global.showLoading("Initializing data...");

            this.db.create({
                name: 'items',
                fields: [{
                    name: 'id'
                }, {
                    name: 'barcode'
                }, {
                    name: 'name'
                }, {
                    name: 'price'
                }, {
                    name: 'pic'
                }, {
                    name: 'cat_id'
                }]
            }, true).then(() => {
                return this.itemService.fetch();
            }).then(data => {
                return this.db.load({
                    name: 'items',
                    mapping: [
                        { db_field: 'id', data_field: 'id' },
                        { db_field: 'name', data_field: 'name' },
                        { db_field: 'barcode', data_field: 'barcode' },
                        { db_field: 'price', data_field: 'price' },
                        { db_field: 'pic', data_field: 'pic' },
                        { db_field: 'cat_id', data_field: 'cat.id' }
                    ]
                }, data);
            }).then(() => {
                this.global.hideLoading();
                this.storage.set('db_sync', new Date().getTime());
            }).catch(err => {
                this.global.hideLoading();
                console.error(err.message);
            });
        }
    }

    logOut(): void {
        this.global.showLoading();
        this.db.dropDatabase().then(() => {
            this.authen.logOut();

            this.global.hideLoading();
            this.router.navigate(['/login']);
        }).catch(res => {
            alert(res.message);
        });
    }
}