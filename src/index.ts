import express from 'express';
import { crawlWebsite } from './crawler';
import { searchData } from './elasticsearch';

const app = express();
const port = 3000;

app.get('/crawl', async (req, res) => {
    const url = req.query.url as string;
    const data = await crawlWebsite(url);
    // await indexData('web_data', data);
    res.send('Data crawled and indexed successfully!');
});

app.get('/search', async (req, res) => {
    const query = req.query.query as string;
    const results = await searchData('web_data', query);
    res.json(results);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
