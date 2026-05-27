import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();
  const product = item.product;
  const imageUrl = product?.images?.[0]?.url || 'https://via.placeholder.com/80?text=N/A';

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
      <img src={imageUrl} alt={product?.name}
        className="h-20 w-20 object-cover rounded-lg flex-shrink-0 bg-gray-100"
        onError={(e) => { e.target.src = 'https://via.placeholder.com/80?text=N/A'; }} />

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate text-sm">{product?.name}</h3>
        <p className="text-blue-600 font-bold mt-0.5">{item.price.toFixed(2)} zł</p>
        {product?.stock < 10 && product?.stock > 0 && (
          <p className="text-xs text-orange-500 mt-0.5">Only {product.stock} left</p>
        )}
      </div>

      {}
      <div className="flex items-center gap-2">
        <button onClick={() => updateQuantity(item._id, item.quantity - 1)}
          className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-600 font-bold transition-colors">
          −
        </button>
        <span className="w-8 text-center font-semibold text-gray-900">{item.quantity}</span>
        <button onClick={() => updateQuantity(item._id, item.quantity + 1)}
          disabled={product?.stock !== undefined && item.quantity >= product.stock}
          className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-600 font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
          +
        </button>
      </div>

      {}
      <div className="text-right min-w-[70px]">
        <p className="font-bold text-gray-900">{(item.price * item.quantity).toFixed(2)} zł</p>
        <button onClick={() => removeItem(item._id)}
          className="text-xs text-red-500 hover:text-red-700 mt-1 transition-colors">
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
