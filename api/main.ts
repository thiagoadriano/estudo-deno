import { Application } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import Router from './routes.ts';

const port = 3000;
const app = new Application();


app.use(Router.routes());
app.use(Router.allowedMethods());

try {
    console.log('Servidor rodando: http://localhost:' + port);
    await app.listen({port});
} catch (error) {
    console.error('Não foi possível rodar o servidor', error);
}


