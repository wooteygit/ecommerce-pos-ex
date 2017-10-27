import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { SharedModule } from './shared.module';

import { AppComponent, AppLayoutComponent } from './components/app.component';
import { LoginComponent } from './components/login/login.component';
import { ItemComponent } from './components/item/item.component';
import { ItemListComponent } from './components/item/item-list/item-list.component';
import { ItemFormComponent } from './components/item/item-list/item-form/item-form.component';
import { SaleComponent } from './components/sale/sale.component';
import { PaymentComponent } from './components/sale/payment/payment.component';

import { TouchableDirective } from './directives/touchable.directive';
import { ScrollerDirective } from './directives/scroller.directive';
import { FocusDirective } from './directives/focus.directive';

import { GlobalService } from './services/global.service';
import { AuthenService } from './services/authen.service';
import { AuthenGuardService } from './services/authen-guard.service';
import { StorageService } from './services/storage.service';
import { DBService } from './services/db.service';
import { MenuService } from './services/menu.service';
import { ItemService } from './services/item.service';
import { WindowService } from './services/window.service';
import { OrderService } from './services/order.service';
import { DialogService } from './services/dialog.service';
import { CategoryService } from './services/category.service';

import { ItemFilterPipe } from './pipes/item-filter.pipe';
import { SignupComponent } from './components/signup/signup.component';
import { DeveloperComponent } from './components/developer/developer.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        SharedModule,
        RouterModule.forRoot([
            {
                path: '',
                component: AppLayoutComponent,
                canActivate: [AuthenGuardService],
                children: [
                    {
                        path: 'sale',
                        component: SaleComponent,
                        children: [
                            {
                                path: 'payment',
                                component: PaymentComponent
                            }
                        ]
                    },
                    {
                        path: 'item',
                        component: ItemComponent,
                        children: [
                            {
                                path: 'list',
                                component: ItemListComponent,
                                children: [
                                    {
                                        path: ':id',
                                        component: ItemFormComponent
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        path: 'create-item',
                        component: ItemFormComponent
                    }
                ]
            },
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'developer',
                component: DeveloperComponent
            },
            {
                path: 'signup',
                component: SignupComponent
            }
        ])
    ],
    declarations: [
        AppComponent,
        AppLayoutComponent,
        LoginComponent,
        ItemComponent,
        ItemFormComponent,
        ItemListComponent,
        SaleComponent,
        PaymentComponent,

        TouchableDirective,
        ScrollerDirective,
        FocusDirective,

        ItemFilterPipe,

        SignupComponent,

        DeveloperComponent
    ],
    providers: [
        GlobalService,
        AuthenService,
        AuthenGuardService,
        StorageService,
        DBService,
        MenuService,
        ItemService,
        WindowService,
        OrderService,
        DialogService,
        CategoryService
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
