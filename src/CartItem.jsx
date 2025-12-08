import React from 'react';
import { useDispatch } from 'react-redux';
import { removeItem, updateQuantity } from '../redux/slices/CartSlice';

const CartItem = ({ item, onContinueShopping }) => {
  const dispatch = useDispatch();

  // ✅ Calculate item subtotal
  const calculateTotalCost = () => {
    // Extract numeric value from cost string (e.g., "$10.99" -> 10.99)
    const unitPrice = parseFloat(item.cost.replace('$', ''));
    return (unitPrice * item.quantity).toFixed(2);
  };

  // ✅ Increment quantity
  const handleIncrement = () => {
    dispatch(updateQuantity({ 
      name: item.name, 
      quantity: item.quantity + 1 
    }));
  };

  // ✅ Decrement quantity with removal at 0
  const handleDecrement = () => {
    if (item.quantity > 1) {
      dispatch(updateQuantity({ 
        name: item.name, 
        quantity: item.quantity - 1 
      }));
    } else {
      // If quantity would become 0, remove the item entirely
      dispatch(removeItem(item.name));
    }
  };

  // ✅ Remove item from cart
  const handleRemove = () => {
    dispatch(removeItem(item.name));
  };

  // ✅ Continue shopping handler
  const handleContinueShopping = (e) => {
    e.preventDefault();
    if (onContinueShopping) {
      onContinueShopping(e);
    }
  };

  // ✅ Checkout handler (placeholder)
  const handleCheckoutShopping = (e) => {
    e.preventDefault();
    alert('Functionality to be added for future reference');
  };

  // ✅ Calculate total amount for all items in cart
  const calculateTotalAmount = () => {
    let total = 0;
    
    // Note: This function should be in a parent component or calculated in Redux
    // This is just for demonstration. In reality, you should have this in Redux state
    // or calculate it in the parent component that has access to all cart items
    
    return total.toFixed(2);
  };

  // Extract numeric price for calculations
  const unitPrice = parseFloat(item.cost.replace('$', ''));

  return (
    <div className="cart-item" data-testid="cart-item">
      <div className="item-image">
        <img 
          src={item.image} 
          alt={item.name} 
          className="item-thumbnail"
        />
      </div>
      
      <div className="item-details">
        <h3 className="item-name">{item.name}</h3>
        <p className="item-price">Price: {item.cost}</p>
        
        <div className="quantity-controls">
          <button 
            onClick={handleDecrement}
            className="quantity-btn decrement"
            aria-label={`Decrease quantity of ${item.name}`}
          >
            -
          </button>
          
          <span className="item-quantity" data-testid="item-quantity">
            {item.quantity}
          </span>
          
          <button 
            onClick={handleIncrement}
            className="quantity-btn increment"
            aria-label={`Increase quantity of ${item.name}`}
          >
            +
          </button>
        </div>
        
        <p className="item-subtotal">
          Subtotal: ${calculateTotalCost()}
        </p>
      </div>
      
      <div className="item-actions">
        <button 
          onClick={handleRemove}
          className="remove-btn"
          aria-label={`Remove ${item.name} from cart`}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

// ✅ For parent component (Cart.jsx or similar) that shows the full cart
const CartItemsList = ({ items, onContinueShopping }) => {
  const dispatch = useDispatch();

  // ✅ Calculate total amount for ALL items in cart
  const calculateTotalAmount = () => {
    if (!items || items.length === 0) return '0.00';
    
    const total = items.reduce((sum, item) => {
      const unitPrice = parseFloat(item.cost.replace('$', ''));
      return sum + (unitPrice * item.quantity);
    }, 0);
    
    return total.toFixed(2);
  };

  // ✅ Calculate total quantity of all items
  const calculateTotalQuantity = () => {
    if (!items || items.length === 0) return 0;
    
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  // ✅ Handle continue shopping
  const handleContinueShopping = (e) => {
    e.preventDefault();
    if (onContinueShopping) {
      onContinueShopping(e);
    }
  };

  // ✅ Handle checkout
  const handleCheckoutShopping = (e) => {
    e.preventDefault();
    alert('Functionality to be added for future reference');
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>Shopping Cart</h2>
        <div className="cart-stats">
          <span className="total-items">
            Items: {calculateTotalQuantity()}
          </span>
          <span className="total-amount">
            Total: ${calculateTotalAmount()}
          </span>
        </div>
      </div>

      <div className="cart-items-list">
        {items && items.length > 0 ? (
          items.map((item, index) => (
            <CartItem 
              key={`${item.name}-${index}`}
              item={item}
              onContinueShopping={onContinueShopping}
            />
          ))
        ) : (
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <button 
              onClick={handleContinueShopping}
              className="continue-shopping-btn"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>

      {items && items.length > 0 && (
        <div className="cart-footer">
          <div className="cart-totals">
            <div className="total-row">
              <span>Total Items:</span>
              <span data-testid="total-items">{calculateTotalQuantity()}</span>
            </div>
            <div className="total-row">
              <span>Total Amount:</span>
              <span data-testid="total-amount">${calculateTotalAmount()}</span>
            </div>
          </div>
          
          <div className="cart-actions">
            <button 
              onClick={handleContinueShopping}
              className="continue-shopping-btn"
            >
              Continue Shopping
            </button>
            
            <button 
              onClick={handleCheckoutShopping}
              className="checkout-btn"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItem;
export { CartItemsList };