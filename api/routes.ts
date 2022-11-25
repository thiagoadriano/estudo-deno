import {Router} from "https://deno.land/x/oak@v11.1.0/mod.ts";
import {
    createProduct,
    updateProduct,
    deleteProduct,
    getOneProduct,
    getProducts,
} from './controller/productController.ts';

const routes = new Router();
const API_URI = '/api/v1';

routes.get(`${API_URI}/products`, getProducts);

routes.get(`${API_URI}/product/:id`, getOneProduct);

routes.post(`${API_URI}/product`, createProduct);

routes.put(`${API_URI}/product/:id`, updateProduct);

routes.delete(`${API_URI}/product/:id`, deleteProduct);

export default routes;