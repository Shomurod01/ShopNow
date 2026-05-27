import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlist([]);
      return;
    }
    try {
      const { data } = await api.get('/auth/wishlist');
      setWishlist(data.wishlist || []);
    } catch (err) {
      console.error('Failed to fetch wishlist', err);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (product) => {
    if (!user) {
      toast.error('Please login to add to wishlist');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/wishlist', { productId: product._id });
      setWishlist(data.wishlist);
      toast.success('Added to wishlist');
    } catch (err) {
      toast.error('Failed to add to wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await api.delete(`/auth/wishlist/${productId}`);
      setWishlist(data.wishlist);
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error('Failed to remove from wishlist');
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item._id === productId || item === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
