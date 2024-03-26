import { Client } from '@elastic/elasticsearch';
const client = new Client({
    node: 'https://e10cc3db53b14769a0f7a8f2c04d5205.us-central1.gcp.cloud.es.io:443', auth: {
        apiKey: "bFY2eWVZNEJRbXRpY2d3OVhEWDI6cHgyakVQZHNSa21NZHllWWNLMy1FZw=="
    }
});

const INDEX_NAME = "test"

// export async function indexData(data: string[]): Promise<void> {
//     await client.index({
//         INDEX_NAME,
//         body: { data }
//     });
// }

// async function searchDocuments(indexName: string, query: string) {
//     const body = await client.search({
//         index: indexName,
//         body: {
//             query: {
//                 match: {
//                     field_name: query // Replace field_name with the name of the field you want to search
//                 }
//             }
//         }
//     });
//     return body.hits.hits;
// }

// async function deleteDocument(indexName: string, id: string) {
//     await client.delete({
//         index: indexName,
//         id: id
//     });
// }


export async function searchData(index: string, query: string): Promise<any> {
    const body = await client.search({
        index,
        q: `field_name:${query}`
    });
    return body.hits.hits;
}

export async function bulkData(body: any[]) {
    try {
        const data = await client.bulk({
            index: INDEX_NAME,
            body: body.flatMap(doc => [{ index: { _index: INDEX_NAME } }, doc])
        });
        return [data, null];
    } catch (error) {
        return [null, error];
    }
}
