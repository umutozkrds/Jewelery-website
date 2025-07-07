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
        const response = await axios.get('https://api.metalpriceapi.com/v1/latest?api_key=b5ff76dec7c7accb0c2a8de134a875a3&base=USD&currencies=XAG', {
            timeout: 10000,
        });
        const goldPricePerGram = response.data.rates.XAG; 
        caches.set('goldPrice', goldPricePerGram);
        return goldPricePerGram;
    } catch (error) {
        console.error('Error fetching gold price:', error);
        return null;
    }
};

const calculatePrice = (popularityScore, weight, goldPrice) => {
        return ((popularityScore+ 1) * weight * goldPrice).toFixed(2);
};

const addCalculatedPrice = (products, index) => {
    const goldPrice = caches.get('goldPrice');
    if (!goldPrice) {
        return;
    }
    const calculatedPrice = calculatePrice(products.popularityScore, products.weight, goldPrice);
    return {
        id : index + 1,
        ...products,
        price: calculatedPrice,
    };
};
const addCalculatedPriceToProducts = (products) => {
    return products.map(addCalculatedPrice);
};


app.get('/api/products', async (req, res) => {
    try {
        const products = await loadProducts();
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

