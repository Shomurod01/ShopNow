import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">My Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
          <div className="w-16 h-16 mx-auto mb-4 text-red-300">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Save items you love to your wishlist. Review them anytime and easily move them to your cart.
          </p>
          <Link to="/products" className="btn-primary px-8 py-3 rounded-full font-bold shadow-lg shadow-blue-500/30">
            Start Browsing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div key={product._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative aspect-[4/3] bg-gray-100">
                <Link to={`/products/${product._id}`}>
                  <img
                    src={product.images?.[0]?.url || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300'; }}
                  />
                </Link>
                <button
                  onClick={() => removeFromWishlist(product._id)}
                  className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </button>
              </div>
              <div className="p-5">
                <Link to={`/products/${product._id}`}>
                  <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">{product.name}</h3>
                </Link>
                <p className="text-blue-600 font-extrabold text-lg mb-4">{product.price.toFixed(2)} zł</p>
                <button
                  onClick={() => addToCart(product, 1)}
                  disabled={product.stock === 0}
                  className="w-full btn-primary py-2.5 flex items-center justify-center gap-2"
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
