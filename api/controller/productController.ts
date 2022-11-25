import {Response, Request} from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { ProductRepository } from '../repository/productRepository.ts';
import { iProduct } from "../interfaces/productInterface.ts";
import { Product } from "../model/product.ts";

const repository = new ProductRepository();

export async function getProducts({response}: {response: Response}) {
    response.body = (await repository.find())?.map(p => productFromJson(p));
}


export async function getOneProduct({response, params}: {response: Response, params: {id: string}}) {
    const prod = await repository.findOne(parseInt(params.id));
    if (prod) {
        response.body = productFromJson(prod);
    } else {
        response.status = 404;
        response.body = {};
    }
}


export async function createProduct({response, request}: {response: Response, request: Request}) {
    if (!request.hasBody) {
        response.status = 400;
        response.body = {
            success: false,
            message: 'Não foi passado os dados'
        };
    } else {
        const body = await request.body();
        const data: iProduct = await body.value;
        const prod = productFromJson(data);

        if (prod.isValid()) {
            const total = await repository.count() ?? 0;
            const newProd = productToJson(prod);
            newProd.id = total + 1;
            const saved = await repository.save(newProd);

            if (saved) {
                prod.id = newProd.id;
                response.status = 201;
                response.body = {
                    success: true,
                    data: prod
                };
            } else {
                response.status = 400;
                response.body = {
                    success: false,
                    message: 'Erro ao salvar o produto'
                };
            }
        } else {
            response.status = 400;
            response.body = {
                success: false,
                message: 'O produto enviado não é válido'
            };
        }
    }

}


export async function updateProduct({response, request, params}: {response: Response, request: Request, params: {id: string}}) {
    if (!request.hasBody) {
        response.status = 400;
        response.body = {
            success: false,
            message: 'Não foi passado os dados'
        };
    } else {
        const body = await request.body();
        const data: iProduct = await body.value;
        const prodSave = await repository.update(parseInt(params.id), data);

        if (prodSave?.modifiedCount) {
            const prodUpdated = await repository.findOne(parseInt(params.id));
            const prod = productFromJson(prodUpdated as iProduct);
            response.status = 200;
            response.body = {
                success: true,
                data: prod
            };
        } else {
            response.status = 400;
            response.body = {
                success: false,
                message: 'Não foi possível atualizar o produto'
            };
        }
    }

}

export async function deleteProduct({response, params}: {response: Response, params: {id: string}}) {
    const prodWillDeleted = await repository.findOne(parseInt(params.id));
    const prodDeleted = await repository.delete(parseInt(params.id)); 
    if (prodDeleted) {
        response.body = {
            success: true,
            data: productFromJson(prodWillDeleted as iProduct)
        };
    } else {
        response.status = 400;
        response.body = {
            success: false,
            message: 'Erro ao deletar o produto'
        };
    }
}

function productFromJson(data: iProduct) {
    const prod = new Product(
        data.title,
        !data.price ? null : typeof data.price === 'string' ? parseInt(data.price) : data.price,
        !data.stock ? null : typeof data.stock === 'string' ? parseInt(data.stock) : data.stock,
        data.brand,
        data.category,
        data.thumbnail
    );
    prod.id = !data.id ? null : typeof data.id === 'string' ? parseInt(data.id) : data.id;
    prod.description = data.description ?? '';
    prod.discountPercentage = !data.discountPercentage ? 0 : typeof data.discountPercentage === 'string' ? parseFloat(data.discountPercentage) : data.discountPercentage;
    prod.rating = !data.rating ? 0 : typeof data.rating === 'string' ? parseInt(data.rating) : data.rating;
    prod.images = Array.isArray(data.images) ? data.images : [];
    return prod;
} 

function productToJson(prod: Product): iProduct {
    return {
        _id: null,
        id: prod.id,
        title: prod.title,
        price: prod.price,
        stock: prod.stock,
        brand: prod.brand,
        category: prod.category,
        thumbnail: prod.thumbnail,
        description: prod.description,
        discountPercentage: prod.discountPercentage,
        rating: prod.rating,
        images: prod.images,
    }
}