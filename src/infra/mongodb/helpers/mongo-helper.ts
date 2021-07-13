import { MongoClient, Collection } from 'mongodb'
import { disconnect } from 'process';

export const MongoHelper = {
    client: null as MongoClient,
    async connect (uri: string): Promise<void> {
        this.client = await MongoClient.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    },
    async disconnect (): Promise<void> {
        this.client.close()
    },
    getCollection (name: string): Collection {
        return this.client.db().collection(name)
    },
    map (collection: any): any {
        const { _id, ...collectionWithoutId } = collection
    
        return Object.assign({}, collectionWithoutId, { id: _id })
    }
}