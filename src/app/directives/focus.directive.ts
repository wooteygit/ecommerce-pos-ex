import { Directive, ElementRef } from '@angular/core';

@Directive({
    selector: '[focus]'
})
export class FocusDirective {

    constructor(private el: ElementRef) {
        setTimeout(() => {
            el.nativeElement.focus();
            el.nativeElement.setSelectionRange && el.nativeElement.setSelectionRange(0, 0);
        }, 0);
    }
}