import { Client } from '@elastic/elasticsearch';
const client = new Client({
    node: 'https://e10cc3db53b14769a0f7a8f2c04d5205.us-central1.gcp.cloud.es.io:443', auth: {
        apiKey: "bFY2eWVZNEJRbXRpY2d3OVhEWDI6cHgyakVQZHNSa21NZHllWWNLMy1FZw=="
    }
});

const INDEX_NAME = "demo"

export async function indexVector(url: string, sentence: string, vector: number[]): Promise<[any, any]> {
    try {
        const data = await client.index({
            index: INDEX_NAME,
            body: {
                sentence,
                url,
                vector: vector.slice(0, 3) // Vector array has 512 elements not storing the whole thing because of limit and time constraints
            }
        });
        console.log(data);
        return [data, null];
    } catch (error) {
        console.log("Error occured while storing");
        console.log(error);
        return [null, error];
    }
}

// Retrieve vectors
export async function retrieveVectors(): Promise<[any, any]> {
    try {
        const body = await client.search({
            index: INDEX_NAME,
            body: {
                query: { match_all: {} },
                size: 1000,
                sort: [{ _doc: { order: "desc" } }]
            }
        });

        body.hits.hits.forEach((hit: any) => {
            console.log(hit._source);
        });
        return [body.hits.hits, null];
    } catch (error) {
        console.log("Error while retrieving");
        console.log(error);
        return [null, error];
    }
}