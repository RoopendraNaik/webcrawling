import { Client } from '@elastic/elasticsearch';
const client = new Client({
    node: 'https://e10cc3db53b14769a0f7a8f2c04d5205.us-central1.gcp.cloud.es.io:443', auth: {
        apiKey: "bFY2eWVZNEJRbXRpY2d3OVhEWDI6cHgyakVQZHNSa21NZHllWWNLMy1FZw=="
    }
});

const INDEX_NAME = "test"

export async function indexVector(sentence: string, vector: number[]): Promise<[any, any]> {
    try {
        const data = await client.index({
            index: INDEX_NAME,
            body: {
                sentence,
                vector: vector.slice(0, 3)
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
            body: { query: { match_all: {} } }
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