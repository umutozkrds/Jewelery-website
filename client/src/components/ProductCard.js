import React, { useState } from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const [selectedGoldType, setSelectedGoldType] = useState('yellow');
    const [imageLoaded, setImageLoaded] = useState(false);

    const goldTypes = [
        { type: 'yellow', label: 'Yellow Gold', color: '#FFD700' },
        { type: 'rose', label: 'Rose Gold', color: '#E8B4A0' },
        { type: 'white', label: 'White Gold', color: '#D3D3D3' }
    ];

    const handleGoldTypeChange = (goldType) => {
        setSelectedGoldType(goldType);
        setImageLoaded(false);
    };

    const formatPrice = (price) => {
        if (typeof price === 'string' && price.includes('not available')) {
            return 'Price on request';
        }
        return `$${parseFloat(price).toLocaleString()}`;
    };

    return (
        <div className="product-card">
            <div className="product-image-container">
                <img
                    src={product.images[selectedGoldType]}
                    alt={`${product.name} in ${selectedGoldType} gold`}
                    className={`product-image ${imageLoaded ? 'loaded' : ''}`}
                    onLoad={() => setImageLoaded(true)}
                    loading="lazy"
                />
                {!imageLoaded && (
                    <div className="image-placeholder">
                        <div className="loading-shimmer"></div>
                    </div>
                )}

                <div className="product-overlay">
                    <button className="quick-view-btn">Quick View</button>
                </div>
            </div>

            <div className="product-info">
                <h3 className="product-name">{product.name}</h3>

                <div className="product-details">
                    <div className="weight-info">
                        <span className="weight-label">Weight:</span>
                        <span className="weight-value">{product.weight}g</span>
                    </div>

                    <div className="popularity-info">
                        <span className="popularity-label">Popularity:</span>
                        <div className="popularity-score">
                            <div className="popularity-bar">
                                <div
                                    className="popularity-fill"
                                    style={{ width: `${product.popularityScore * 100}%` }}
                                ></div>
                            </div>
                            <span className="popularity-text">
                                {(product.popularityScore * 5).toFixed(1)}/5
                            </span>
                        </div>
                    </div>
                </div>

                <div className="gold-type-selector">
                    <span className="gold-type-label">Gold Type:</span>
                    <div className="gold-type-options">
                        {goldTypes.map((gold) => (
                            <button
                                key={gold.type}
                                className={`gold-type-btn ${selectedGoldType === gold.type ? 'active' : ''}`}
                                onClick={() => handleGoldTypeChange(gold.type)}
                                title={gold.label}
                                style={{ backgroundColor: gold.color }}
                            >
                                <span className="sr-only">{gold.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="product-price">
                    <span className="price-label">Current Price:</span>
                    <span className="price-value">{formatPrice(product.price)}</span>
                </div>

                <div className="product-actions">
                    <button className="add-to-cart-btn">Add to Cart</button>
                    <button className="wishlist-btn" aria-label="Add to wishlist">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard; 