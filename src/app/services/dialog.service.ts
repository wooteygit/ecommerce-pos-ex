import { Injectable } from '@angular/core';

@Injectable()
export class DialogService {
    confirm(message: string, title: string = null): Promise<any> {
        return new Promise((resolve, reject) => {
            var res = confirm(message);
            if (res) {
                resolve(true);
            }
            else {
                resolve(false);
            }
        });
    }

    alert(message: string, title: string = null): Promise<any> {
        return new Promise((resolve, reject) => {
            alert(message);
            resolve(true);
        });
    }
}