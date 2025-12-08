import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, removeItem, updateQuantity } from './CartSlice';

const ProductList = ({ plants = [] }) => {
  const dispatch = useDispatch();
  
  // Get cart items from Redux store
  const cartItems = useSelector(state => state.cart?.items || []);
  
  // Local state for search/filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  

  const calculateTotalQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };
  
 
  const handleAddToCart = (plant) => {
       dispatch(addItem({
      name: plant.name,
      image: plant.image,
      cost: plant.price || plant.cost, // Use whichever field your data has
      // Add any other necessary fields
    }));
  };
  
  
  const filteredPlants = plants.filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plant.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || 
                           plant.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // ✅ Check if plant is already in cart
  const isPlantInCart = (plantName) => {
    return cartItems.some(item => item.name === plantName);
  };
  
  // ✅ Get quantity of specific plant in cart
  const getPlantQuantityInCart = (plantName) => {
    const item = cartItems.find(item => item.name === plantName);
    return item ? item.quantity : 0;
  };
  
  // ✅ Get unique categories for filter dropdown
  const categories = ['All', ...new Set(plants.map(plant => plant.category))];
  
  const totalQuantity = calculateTotalQuantity();
  
  return (
    <div className="product-list-container" data-testid="product-list">
      <div className="product-list-header">
        <h1>Plant Shop</h1>
        
        <div className="cart-summary">
          <span className="cart-icon">
            🛒 <span className="cart-count">{totalQuantity}</span>
          </span>
          <span className="cart-text">
            {totalQuantity} item{totalQuantity !== 1 ? 's' : ''} in cart
          </span>
        </div>
      </div>
      
      {/* Search and Filter Controls */}
      <div className="controls-row">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search plants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            aria-label="Search plants"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="clear-search"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        
        <div className="filter-container">
          <label htmlFor="category-filter" className="filter-label">
            Filter by Category:
          </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Plants Count */}
      <div className="plants-count">
        <p>
          Showing {filteredPlants.length} of {plants.length} plants
          {searchTerm && ` for "${searchTerm}"`}
          {selectedCategory !== 'All' && ` in "${selectedCategory}"`}
        </p>
      </div>
      
      {/* Plants Grid */}
      {filteredPlants.length > 0 ? (
        <div className="plants-grid">
          {filteredPlants.map((plant) => (
            <div key={plant.id || plant.name} className="plant-card-wrapper">
              <PlantCard
                plant={plant}
                onAddToCart={() => handleAddToCart(plant)}
                isInCart={isPlantInCart(plant.name)}
                quantityInCart={getPlantQuantityInCart(plant.name)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="no-plants-message">
          <p>No plants found matching your criteria.</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}
            className="clear-filters-btn"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
const PlantCard = ({ plant, onAddToCart, isInCart, quantityInCart }) => {
  const [isAdding, setIsAdding] = useState(false);
  
  const handleAddClick = async () => {
    if (!isInCart) {
      setIsAdding(true);
      try {
        await onAddToCart();
      } finally {
        // Keep button in "added" state
      }
    }
  };
  
  // Parse price safely
  const price = typeof plant.price === 'string' 
    ? parseFloat(plant.price.replace('$', '')) 
    : plant.price || 0;
  
  return (
    <div className="plant-card" data-testid={`plant-card-${plant.name}`}>
      <div className="plant-image-container">
        <img 
          src={plant.image} 
          alt={plant.name} 
          className="plant-image"
          loading="lazy"
        />
        {quantityInCart > 0 && (
          <div className="cart-badge">
            {quantityInCart} in cart
          </div>
        )}
      </div>
      
      <div className="plant-info">
        <h3 className="plant-name">{plant.name}</h3>
        
        {plant.category && (
          <span className="plant-category">{plant.category}</span>
        )}
        
        {plant.description && (
          <p className="plant-description">{plant.description}</p>
        )}
        
        <div className="plant-price-section">
          <span className="plant-price">
            ${price.toFixed(2)}
          </span>
          
          {plant.originalPrice && (
            <span className="plant-original-price">
              ${parseFloat(plant.originalPrice).toFixed(2)}
            </span>
          )}
          
          {plant.discount && (
            <span className="plant-discount">
              {plant.discount}% off
            </span>
          )}
        </div>
        
        <div className="plant-actions">
          <button
            onClick={handleAddClick}
            disabled={isAdding || isInCart}
            className={`add-to-cart-btn ${isInCart ? 'added' : ''}`}
            data-testid={`add-to-cart-${plant.name}`}
            aria-label={isInCart ? `Added ${plant.name} to cart` : `Add ${plant.name} to cart`}
          >
            {isAdding ? 'Adding...' : 
             isInCart ? '✓ Added to Cart' : 
             'Add to Cart'}
          </button>
          
          {isInCart && (
            <div className="in-cart-message">
              ✓ {quantityInCart} in cart
            </div>
          )}
        </div>
        
        {/* Additional plant details */}
        {plant.light && (
          <div className="plant-details">
            <span className="detail-item">☀️ {plant.light}</span>
            {plant.water && <span className="detail-item">💧 {plant.water}</span>}
            {plant.difficulty && <span className="detail-item">⭐ {plant.difficulty}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;