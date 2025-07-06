const express = require('express');
const cors = require('cors');
const fs = require('fs');
const NodeCache = require('node-cache');
const axios = require('axios');


const caches = new NodeCache({ stdTTL:1000 });



const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());


const loadProducts = async () => {
    try {
        const data = fs.readFileSync(__dirname, "data",  'products.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading products:', error);
        return [];
    }
};

const fetchGold = async () => {
    try {
        const fetchedPrice = caches.get('goldPrice');
        if (fetchedPrice) {
            return fetchedPrice;
        }
        const response = await axios.get('https://api.metals.live/v1/spot/gold', {
            timeout: 10000,
        });
        const price = response.data.price;
        const goldPricePerGram = price / 31.1;
        caches.set('goldPrice', goldPricePerGram);
        return goldPricePerGram;
    } catch (error) {
        console.error('Error fetching gold price:', error);
        return null;
    }
};




