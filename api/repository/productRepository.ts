import { DataBase } from './database.ts';
import { iProduct } from '../interfaces/productInterface.ts';

export class ProductRepository extends DataBase<iProduct> {
    constructor() {
        super('product');
    }
}