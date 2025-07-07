import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';

function App() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get('https://jewelery-website-production.up.railway.app/api/products');
            setProducts(response.data);
        } catch (err) {
            setError('Failed to load products. Please try again later.');
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRetry = () => {
        fetchProducts();
    };

    return (
        <div className="App">
            <Header />

            <main className="main-content">


                <section className="products-section">
                    <div className="container">
                        {loading && <LoadingSpinner />}
                        {error && <ErrorMessage message={error} onRetry={handleRetry} />}
                        {!loading && !error && (
                            <>
                                <div className="section-header">
                                    <h2 className="section-title">Product list</h2>
                                    <p className="section-subtitle">
                                        Each piece is crafted with precision and priced according to current gold market rates
                                    </p>
                                </div>
                                <ProductGrid products={products} />
                            </>
                        )}
                    </div>
                </section>
            </main>

            <footer className="footer">
                <div className="container">
                    <p>&copy; 2024 Luxe Jewelry. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default App; 