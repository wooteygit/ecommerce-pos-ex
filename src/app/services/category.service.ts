import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { DBService } from './db.service';

import { CategoryModel } from '../models/category.model';

import { Config } from '../../environments/environment';

@Injectable()
export class CategoryService {
    data: CategoryModel[] = [];

    constructor(private http: HttpClient, private db: DBService) { 
        this.sync();
    }

    list(): Promise<any> {
        return this.http.get(Config.ServiceUrl + '/data/categories.json?' + new Date().getTime())
            .toPromise()
            .then(data => {
                return data;
            });
    }

    find(filter): Promise<any> {
        return this.db.find({
            table: 'categories',
            filter: filter
        });
    }

    sync(): void {
        this.db.find({
            table: 'categories'
        })
        .then(data => {
            this.data = data;
        });
    }
}