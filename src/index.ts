import express from 'express';
import { crawlWebsite, queryData } from './crawler';

const app = express();
const port = 3000;

app.get('/crawl', async (req, res) => {
    const url = req.query.url as string;
    const [status, data] = await crawlWebsite(url);
    res.status(status).send(data);;
});

app.get('/search', async (req, res) => {
    const [status, data] = await queryData()
    res.status(status).send(data);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
