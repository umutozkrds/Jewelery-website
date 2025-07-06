const express = require('express');
const cors = require('cors');
const fs = require('fs');


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

const products = loadProducts();
