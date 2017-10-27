import { CategoryModel } from './category.model';

export class ItemModel {
    id?: number;
    barcode?: string;
    name?: string;
    price?: number;
    pic?: string;
    cat?: CategoryModel;
}