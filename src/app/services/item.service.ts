import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { DBService } from './db.service';

import { ItemModel } from '../models/item.model';
import { Limit } from '../models/db.model';

import { Config } from '../../environments/environment';

@Injectable()
export class ItemService {
    constructor(private http: HttpClient, private db: DBService) {}

    fetch(): Promise<any> {
        return this.http.get(Config.ServiceUrl + '/web/data/items.json?' + new Date().getTime())
            .toPromise()
            .then(data => {
                return data;
            });
    }

    matching(): Promise<any> {
        return this.http.get(Config.ServiceUrl + '/web/data/item.json?' + new Date().getTime())
            .toPromise()
            .then(data => {
                return data;
            });
    }

    find(filter?, limit?: Limit): Promise<any> {
        return this.db.find({
            table: 'items',
            filter: filter,
            limit: limit
        });
    }
}