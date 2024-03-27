import axios from 'axios';
import * as tfm from '@tensorflow-models/universal-sentence-encoder';
import cheerio from 'cheerio';
import * as tf from '@tensorflow/tfjs';
import { indexVector, retrieveVectors } from './elasticsearch';


async function textToVector(text: string): Promise<number[]> {
    try {
        // Load the Universal Sentence Encoder model
        const model = await tfm.load();

        // Embed the text using the Universal Sentence Encoder
        const embeddings = await model.embed([text]);

        // Convert embeddings tensor to array
        const embeddingsArray = await embeddings.array();

        // Flatten the embeddings array
        const vector = embeddingsArray[0];

        return vector;
    } catch (error) {
        console.error('Error converting text to vector:', error);
        throw error;
    }
}

// Function to recursively extract text from nested elements

// We can extend many other types overhere
// TODO links, responsetypes etc. 
// extractDataFromElement => html and in recursion and types of data we want
function extractData(html: string): void {
    try {
        tf.setBackend('cpu')
        const $ = cheerio.load(html);

        // Extract text from the entire HTML content
        // Function to recursively extract text from nested elements
        function extractTextFromElement(element: any): string {
            try {
                let text = '';

                text += element.text().trim() + ' ';

                element.children().each((_index: any, child: any) => {
                    text += extractTextFromElement($(child));
                });

                return text;
            } catch (error) {
                console.log("Error occured in extractTextFromElement recussion == chill");
                console.log(error);
                return ''
            }
        }

        const allText = extractTextFromElement($.root());
        console.log("Substring==", allText.substring(0, 100));
    } catch (error) {
        console.log("Error Occured in extractData");
        console.log(error);
    }
}

async function fetchPage(url: string): Promise<string> {
    const response = await axios.get(url);
    return response.data;
}

export async function crawlWebsite(url: string): Promise<[number, any]> {
    try {
        const textData = await fetchPage(url);

        extractData(textData);
        const words = textData.split(/\s+/);

        const sentenses: string[] = [];
        // creating sentenses with 10 words
        for (let i = 0; i < words.length; i += 10) {
            sentenses.push(words.slice(i, i + 10).join(' '));
        }

        console.log(words.length);

        console.log(sentenses);
        console.log(sentenses.length);

        process.nextTick(async () => {
            const success = [];
            const failures = []
            for (let i = 0; i < sentenses.length; i++) {
                const sentense = sentenses[i];
                const vectorizedData: number[] = await textToVector(sentense);
                if (i === 0) {
                    console.log("i===0");
                    console.log(vectorizedData.length);
                    console.log(sentenses)
                }

                const [data, err] = await indexVector(url, sentense, vectorizedData);
                if (!data || err) failures.push(data);
                success.push(data);
            }
            console.log("success", success);
            console.log("failures", failures);
        })
        return [200, { status: 'OK' }]
    } catch (error) {
        return [500, error];
    }
}

export async function queryData(): Promise<[number, any]> {
    const [data, err] = await retrieveVectors();
    if (data) return [200, data];
    return [500, err];
}