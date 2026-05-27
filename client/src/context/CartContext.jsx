import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);
const CART_KEY = 'guestCart';

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      syncWithServer();
    } else {
      loadGuest();
    }
  }, [user]);

  const loadGuest = () => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      setCartItems(saved ? JSON.parse(saved) : []);
    } catch (_) { setCartItems([]); }
  };

  const saveGuest = (items) => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  };

  const syncWithServer = async () => {
    setLoading(true);
    try {
      const guestCart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
      for (const item of guestCart) {
        try {
          await cartAPI.add({
            productId: item.product?._id || item.product,
            quantity: item.quantity,
          });
        } catch (_) {}
      }
      localStorage.removeItem(CART_KEY);
      const { data } = await cartAPI.get();
      setCartItems(data.cart?.items || []);
    } catch (_) {
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = useCallback(async (product, quantity = 1) => {
    if (user) {
      try {
        const { data } = await cartAPI.add({ productId: product._id, quantity });
        setCartItems(data.cart.items);
        toast.success('Added to cart!');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to add to cart');
      }
    } else {
      setCartItems((prev) => {
        const idx = prev.findIndex((i) => (i.product?._id || i.product) === product._id);
        let updated;
        if (idx >= 0) {
          updated = prev.map((i, n) => n === idx ? { ...i, quantity } : i);
        } else {
          updated = [...prev, {
            _id: `guest-${Date.now()}`,
            product,
            quantity,
            price: product.price,
          }];
        }
        saveGuest(updated);
        return updated;
      });
      toast.success('Added to cart!');
    }
  }, [user]);

  const updateQuantity = useCallback(async (itemId, quantity) => {
    if (user) {
      try {
        const { data } = await cartAPI.update(itemId, { quantity });
        setCartItems(data.cart.items);
      } catch (_) { toast.error('Failed to update cart'); }
    } else {
      setCartItems((prev) => {
        const updated = quantity <= 0
          ? prev.filter((i) => i._id !== itemId)
          : prev.map((i) => i._id === itemId ? { ...i, quantity } : i);
        saveGuest(updated);
        return updated;
      });
    }
  }, [user]);

  const removeItem = useCallback(async (itemId) => {
    if (user) {
      try {
        const { data } = await cartAPI.remove(itemId);
        setCartItems(data.cart.items);
        toast.success('Item removed');
      } catch (_) { toast.error('Failed to remove item'); }
    } else {
      setCartItems((prev) => {
        const updated = prev.filter((i) => i._id !== itemId);
        saveGuest(updated);
        return updated;
      });
      toast.success('Item removed');
    }
  }, [user]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    if (!user) localStorage.removeItem(CART_KEY);
  }, [user]);

  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, cartTotal, cartCount, loading, addToCart, updateQuantity, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
