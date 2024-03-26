import * as fs from 'fs';
import { Word2VecKeyedVectors } from 'gensim';
import { tokenize } from 'natural';
import axios from 'axios';

// Load pre-trained Word2Vec model
const modelPath = 'path/to/word2vec/model.bin'; // Replace with the path to your pre-trained Word2Vec model
const word2vecModel: Word2VecKeyedVectors = JSON.parse(fs.readFileSync(modelPath, 'utf-8'));

function textToVector(text: string): number[] {
    const tokens = tokenize(text.toLowerCase()); // Tokenize text data
    let vectorSum: number[] = Array.from({ length: word2vecModel.size }, () => 0); // Initialize vector sum
    let count = 0;

    for (const token of tokens) {
        if (word2vecModel.vocab.hasOwnProperty(token)) {
            const vector = word2vecModel.getVector(token);
            vectorSum = vectorSum.map((val, idx) => val + vector[idx]);
            count++;
        }
    }

    if (count > 0) {
        return vectorSum.map(val => val / count); // Average the vectors
    } else {
        return [];
    }
}

export async function fetchPage(url: string): Promise<string[]> {
    const response = await axios.get(url);
    return [response.data];
}

export async function crawlWebsite(html: string): Promise<string[]> {
    const textData = await fetchPage(html);
    const vectorizedData: number[][] = textData.map(textToVector);
    console.log('Vectorized Data:', vectorizedData);
    return data;
}
