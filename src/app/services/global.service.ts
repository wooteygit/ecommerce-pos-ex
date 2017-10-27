import { Injectable } from '@angular/core';

@Injectable()
export class GlobalService {
    loading: boolean = false;
    loadingText: string = "";

    showLoading(text?: string): void {
        this.loading = true;
        if (text) {
            this.loadingText = text;
        }
    }
    hideLoading(): void {
        this.loading = false;
        this.loadingText = "";
    }
}