import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // Changed from hardcoded array to empty
  totalQuantity: 0, // Added for easy total calculation
  totalAmount: 0, // Added for easy total amount calculation
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { name, image, cost } = action.payload;
      
      
      const existingItem = state.items.find(item => item.name === name);
      
      if (existingItem) {

        existingItem.quantity += 1;
      } else {
        // If item doesn't exist, add it with quantity 1
        state.items.push({ 
          name, 
          image, 
          cost, 
          quantity: 1 
        });
      }
      
      // Update totals
      state.totalQuantity += 1;
      state.totalAmount += cost;
    },
    
        removeItem: (state, action) => {
      const itemName = action.payload; // Payload should be the item name
      
      const itemToRemove = state.items.find(item => item.name === itemName);
      
      if (itemToRemove) {
        state.totalQuantity -= itemToRemove.quantity;
        state.totalAmount -= (itemToRemove.cost * itemToRemove.quantity);
                state.items = state.items.filter(item => item.name !== itemName);
      }
    },
    
      updateQuantity: (state, action) => {
      const { name, quantity } = action.payload;
      
      const itemToUpdate = state.items.find(item => item.name === name);
      
      if (itemToUpdate) {
        const quantityDiff = quantity - itemToUpdate.quantity;
        
        itemToUpdate.quantity = quantity;
        
        state.totalQuantity += quantityDiff;
        state.totalAmount += (quantityDiff * itemToUpdate.cost);
        
        if (itemToUpdate.quantity <= 0) {
          state.items = state.items.filter(item => item.name !== name);
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },
    increaseQuantity: (state, action) => {
      const itemName = action.payload;
      const item = state.items.find(item => item.name === itemName);
      
      if (item) {
        item.quantity += 1;
        state.totalQuantity += 1;
        state.totalAmount += item.cost;
      }
    },
    
    decreaseQuantity: (state, action) => {
      const itemName = action.payload;
      const item = state.items.find(item => item.name === itemName);
      
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
          state.totalQuantity -= 1;
          state.totalAmount -= item.cost;
        } else {
          // Remove item if quantity becomes 0
          state.totalQuantity -= 1;
          state.totalAmount -= item.cost;
          state.items = state.items.filter(item => item.name !== itemName);
        }
      }
    }
  },
});


export const { 
  addItem, 
  removeItem, 
  updateQuantity, 
  clearCart,
  increaseQuantity,
  decreaseQuantity 
} = cartSlice.actions;


export default cartSlice.reducer;