import {MongoClient, Database, Collection, ObjectId, Filter} from "https://deno.land/x/mongo@v0.31.1/mod.ts";

export class DataBase<S extends {_id: ObjectId}> {
    private URL_CONNECT = 'mongodb://127.0.0.1:27017/dbstore';
    private db?: Database;
    private schema?: Collection<S>;
    private schemaName: string;

    constructor(_schemaName:string) {
        this.schemaName = _schemaName;
        this.connect();
    }

    async connect() {
        try {
            if (!this.db) {
                const client = new MongoClient();
                this.db = await client.connect(this.URL_CONNECT);
                this.schema = this.db.collection<S>(this.schemaName);
                console.log('Conectado ao banco!');
            }
        } catch(e) {
            console.error('Erro ao conectar ao banco de dados: ', e);
        }
    
    }

    save(data: S): Promise<ObjectId> | undefined {
        return this.schema?.insertOne(data);
    }

    delete(id: number): Promise<number> | undefined {
        return this.schema?.deleteOne({id} as any);
    }

    update(id: number, data: S): Promise<{
        upsertedId: ObjectId | undefined;
        upsertedCount: number;
        matchedCount: number;
        modifiedCount: number;
    }> | undefined {
        return this.schema?.updateOne({id: {$eq: id}} as any, {$set: {...data}} as any, {upsert: true});
    }

    find(filter: Filter<S> = {}): Promise<S[]> | undefined {
        return this.schema?.find(filter).toArray();
    }

    findOne(id: number): Promise<S | undefined> | undefined {
        return this.schema?.findOne({id} as any);
    }

    count(): Promise<number> | undefined {
        return this.schema?.countDocuments();
    }


}