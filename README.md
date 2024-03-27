# webcrawling

# About

This is a repository is about fetching texual data via web crawling, converting that data to vecorized format using ML Model and storing it in vectorDB.

# Tech stack 

- Tensorflow (for converting textual data using ML models)
- express (backend server)
- elasticsearch for storing Data in elasticsearch vectorDB
  
# TensorFlow and Cheerio

- @tensorflow-models/universal-sentence-encoder package to convert text data to vector format
- you can find all the related information in crawler.ts, which does web crawing using Cheerio and converts data to vector format using universal-sentence-encoder
- Using Cheerio we are fetching text form each element using extractData function reference to it for more details

# elasticsearch

- I am using elasticsearch API(trail version) to store and read all the vector information
- reference(<https://www.elastic.co/guide/en/elasticsearch/reference/current/getting-started.html>)
- you can find all the related information in elasticsearch.ts, which reads and stores data
  
# API's

- Start the server using npm run start(it will run on nodemon)
- GET http://localhost:3000/crawl?url=https://google.com/ which does web crawling on URL passed
- GET http://localhost:3000/search which fetches data from elastic search

# TODO

- Currently elasticsearch creds are hard coded with my creds, can use dotenv and move it to .env file
- you can replace those creds if you want to use your own vectorDB in elasticsearch
- extractData can be extended to many other data types(urls, text, images and all)
- There isn't much of a structure used for storing data current text and respective vector is being stored, can extended it to store metaData
- Storing vectors is happening 1 by 1, improve this to store multiple

# Note

- There was a lot of research done on wordTovector converstion using tensorflow, can explain better over a call
- Less focus was given on storing data in vectorDB