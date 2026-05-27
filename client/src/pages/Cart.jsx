import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import CartItem from '../components/CartItem'

const Cart = () => {
  const { cartItems, cartTotal, clearCart } = useCart()

  const shipping = cartTotal > 100 ? 0 : 9.99
  const tax = Math.round(cartTotal * 0.08 * 100) / 100
  const total = cartTotal + shipping + tax

  if (cartItems.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 mx-auto mb-6 text-gray-300">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/products" className="btn-primary px-8 py-3 text-base">Browse Products</Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Shopping Cart <span className="text-gray-400 font-normal text-lg">({cartItems.length} item{cartItems.length !== 1 ? 's' : ''})</span>
        </h1>
        <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors">
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => <CartItem key={item._id} item={item} />)}
        </div>

        <div className="card p-6 h-fit sticky top-24">
          <h2 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">{cartTotal.toFixed(2)} zł</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              {shipping === 0
                ? <span className="text-green-600 font-medium">Free </span>
                : <span className="font-medium text-gray-900">{shipping.toFixed(2)} zł</span>}
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax (8%)</span>
              <span className="font-medium text-gray-900">{tax.toFixed(2)} zł</span>
            </div>
          </div>

          <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">Total</span>
            <span className="text-2xl font-extrabold text-gray-900">{total.toFixed(2)} zł</span>
          </div>

          {shipping > 0 && (
            <p className="text-xs text-gray-400 mt-2 text-center">
              Add <span className="font-semibold text-gray-600">{(100 - cartTotal).toFixed(2)} zł</span> more for free shipping
            </p>
          )}

          <Link to="/checkout"
            className="block mt-5 bg-blue-600 text-white text-center py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
            Proceed to Checkout →
          </Link>
          <Link to="/products"
            className="block mt-3 text-center text-sm text-gray-500 hover:text-blue-600 transition-colors">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Cart
