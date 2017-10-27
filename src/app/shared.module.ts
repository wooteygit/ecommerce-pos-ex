import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SpinnerElement } from './elements/spinner/spinner.element';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        SpinnerElement
    ],
    providers: [
    ],
    exports: [
        SpinnerElement
    ]
})
export class SharedModule { }