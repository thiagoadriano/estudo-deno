import { ObjectId } from 'https://deno.land/x/mongo@v0.31.1/mod.ts';
export interface iProduct{
    _id: ObjectId | null;
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
}