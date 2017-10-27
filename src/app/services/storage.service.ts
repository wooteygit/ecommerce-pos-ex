import 'rxjs/add/operator/toPromise';

import { Inject, Injectable } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Config } from '../../environments/environment';

@Injectable()
export class StorageService {

    set(key: string, data: any): void {
        key = Config.StoragePrefix + key;
        localStorage.setItem(key, JSON.stringify(data));
    }

    get(key: string) {
        key = Config.StoragePrefix + key;
        let data = localStorage.getItem(key);
        if (data) {
            return JSON.parse(data);
        }
        return null;
    }

    remove(key: string) {
        key = Config.StoragePrefix + key;
        localStorage.removeItem(key);
    }
}