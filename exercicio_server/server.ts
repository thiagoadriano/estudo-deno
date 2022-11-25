import { Employee } from "./employee.ts";
import {serve} from 'https://deno.land/std@0.165.0/http/mod.ts';

// const handler = async (conn: Deno.Conn) => {
//     for await (const req of Deno.serveHttp(conn)) {
//         const data: Employee[] =  [];
        
//         data.push(new Employee(1, 'Sam', 'Manager'));
//         data.push(new Employee(2, 'Michael', 'Worker'));
//         data.push(new Employee(3, 'Antonio', 'Accountant'));
        
//         req.respondWith(new Response(JSON.stringify(data)));
//     }
// }

// console.log('Rodando em localhost:3000');

// for await (const conn of Deno.listen({port: 3000})) {
//     handler(conn);
// }

const handler = (req: Request) => {
    console.log(req);
    const data: Employee[] =  [];
        
    data.push(new Employee(1, 'Sam', 'Manager'));
    data.push(new Employee(2, 'Michael', 'Worker'));
    data.push(new Employee(3, 'Antonio', 'Accountant'));
   
    return new Response(JSON.stringify(data));
};

serve(handler, {port: 3000});