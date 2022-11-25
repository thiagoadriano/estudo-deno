import * as fs from "https://deno.land/std@0.165.0/fs/mod.ts";
import * as path from "https://deno.land/std@0.165.0/node/path/mod.ts";

// rodar com deno run --allow-read --allow-write filesystem.ts


try {
    const file = path.basename(import.meta.url);
    const dir = path.fromFileUrl(import.meta.url).replace(file, '');
    const dirFiles = dir + '/teste/';
    
    const list:AsyncIterableIterator<fs.WalkEntry> = fs.walk(dirFiles);
    for await (const item of list) {
        
        if (item.isFile) {
            let file = Deno.openSync(dirFiles + item.name);
            let bytes = new Uint8Array(100);
            file.readSync(bytes);
            console.log(new TextDecoder().decode(bytes));
            file.close();
        }   
    }
    
} catch(err) {
    console.error(err);
    
}