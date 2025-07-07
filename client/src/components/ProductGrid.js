import React from 'react';
import ProductCard from './ProductCard';
import './ProductGrid.css';

const ProductGrid = ({ products }) => {
    if (!products || products.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">💍</div>
                <h3>No products available</h3>
                <p>Our collection is being updated. Please check back soon.</p>
            </div>
        );
    }

    return (
        <div className="product-grid">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};

export default ProductGrid; 