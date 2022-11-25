export class Product {
    id?:number | null;
    title: string;
    price: number | null;
    stock: number | null;
    brand: string;
    category: string;
    thumbnail: string;
    description?: string;
    discountPercentage?: number;
    rating?: number;
    images?: string[];

    constructor(
        title: string,
        price: number | null,
        stock: number | null,
        brand: string,
        category: string,
        thumbnail: string,
    ) {
        this.title = title;
        this.price = price;
        this.stock = stock;
        this.brand = brand;
        this.category = category;
        this.thumbnail = thumbnail;
    }

    isValid() {
        return this.brand && 
               this.category && 
               this.price && 
               this.stock && 
               this.thumbnail && 
               this.title;
    }
}