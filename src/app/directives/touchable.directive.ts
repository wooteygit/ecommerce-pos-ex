import { Directive, HostBinding, EventEmitter, HostListener, Input, Output } from '@angular/core';

declare var $: any;

@Directive({
    selector: '[touchable]'
})
export class TouchableDirective {
    target: any;

    private getPosition(event) {
        let t = (event.touches && event.touches.length)? event.touches: null;
        if (!t && event.changedTouches && event.changedTouches.length) {
            t = event.changedTouches;
        }

        if (t) {
            return {
                x: t[0].clientX,
                y: t[0].clientY
            };
        }
        return null;
    }

    private getElement(event) {
        let pos = this.getPosition(event);
        if (pos) {
            return document.elementFromPoint(pos.x, pos.y);
        }
        return null;
    }

    private getGuid(): string {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    }

    @Output() singletap = new EventEmitter<any>();

    @HostBinding('attr.guid') guid = this.getGuid();

    @HostListener('click', ['$event']) onClick(event) {
        event.preventDefault();
        
        this.singletap.emit();
    }

    @HostListener('touchstart', ['$event']) onTouchStart(event) {
        event.preventDefault();

        let current = event.target;
        if (!current.getAttribute('guid')) {
            current = $(current).closest('[guid]')[0];
        }
        this.target = current;
    }

    @HostListener('touchend', ['$event']) onTouchEnd(event) {
        event.preventDefault();
        
        let currentElement = this.getElement(event);
        let prev = this.target.getAttribute('guid');
        let current = currentElement.getAttribute('guid');
        if (prev == current) {
            this.singletap.emit();
        }
        else {
            let elm = $(currentElement).closest('[guid="' + prev + '"]');
            if (elm.length > 0) {
                this.singletap.emit();
            }
        }
    }
}