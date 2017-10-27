import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { AuthenService } from '../../services/authen.service';
import { StorageService } from '../../services/storage.service';

import { UserModel } from '../../models/user.model';

@Component({
    selector: 'my-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    loading: boolean = false;

    constructor(private router: Router, private authen: AuthenService, private storage: StorageService) { }

    ngOnInit() {
    }

    logIn(): void {
        this.loading = true;
        setTimeout(() => {
            let user: UserModel = {
                id: 1,
                email: 'nahm.pos@thailandpost.com',
                first_name: 'Nahm',
                last_name: 'POS'
            };
            this.authen.user = user;
            this.storage.set('user', user);
    
            this.router.navigate(["/"]);              
        }, 1500); 
    }
}
