const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const NodeCache = require('node-cache');
const axios = require('axios');

const caches = new NodeCache({ stdTTL: 1000 });

const app = express();
const port = 3000;

app.use(cors({
    origin: ['https://jewelery-site-gwtmpytpv-umutozkrds-projects.vercel.app', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400
}));
app.use(express.json());

const loadProducts = async () => {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'data', 'products.json'), 'utf8');
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
        const response = await axios.get('https://api.metalpriceapi.com/v1/latest?api_key=b5ff76dec7c7accb0c2a8de134a875a3&base=USD&currencies=XAU', {
            timeout: 10000,
        });
        const goldPrice = 1 / response.data.rates.XAU;
        const goldPricePerGram = goldPrice / 31.1;
        caches.set('goldPrice', goldPricePerGram);
        return goldPricePerGram;
    } catch (error) {
        console.error('Error fetching gold price:', error);
        return null;
    }
};

const calculatePrice = (popularityScore, weight, goldPrice) => {
    return ((popularityScore + 1) * weight * goldPrice).toFixed(2);
};

const addCalculatedPrice = (product, index, goldPrice) => {
    if (!goldPrice) {
        console.warn('Gold price not available, skipping price calculation');
        return {
            id: index + 1,
            ...product,
            price: 'Price not available'
        };
    }
    const calculatedPrice = calculatePrice(product.popularityScore, product.weight, goldPrice);
    return {
        id: index + 1,
        ...product,
        price: calculatedPrice,
    };
};

const addCalculatedPriceToProducts = (products) => {
    const goldPrice = caches.get('goldPrice');
    return products.map((product, index) => addCalculatedPrice(product, index, goldPrice));
};

app.get('/api/products', async (req, res) => {
    try {
        const products = await loadProducts();

        // Ensure we have gold price
        let goldPrice = caches.get('goldPrice');
        if (!goldPrice) {
            console.log('Gold price not cached, fetching...');
            goldPrice = await fetchGold();
        }

        const calculatedProducts = addCalculatedPriceToProducts(products);
        res.json(calculatedProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    const goldPrice = await fetchGold();
    console.log(`Gold price: ${goldPrice}`);
});

