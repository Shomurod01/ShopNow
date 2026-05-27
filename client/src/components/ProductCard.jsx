import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

const Stars = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <svg key={s} className={`h-3.5 w-3.5 ${s <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`}
        fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
    {rating > 0 && <span className="text-xs text-gray-500 ml-1">({rating.toFixed(1)})</span>}
  </div>
)

// just a map so category badges have different colors
const catColors = {
  Electronics: 'bg-blue-100 text-blue-700',
  Clothing: 'bg-pink-100 text-pink-700',
  Books: 'bg-amber-100 text-amber-700',
  Sports: 'bg-green-100 text-green-700',
  'Home & Garden': 'bg-purple-100 text-purple-700',
  Toys: 'bg-red-100 text-red-700'
}

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const [adding, setAdding] = useState(false)
  const isWishlisted = isInWishlist(product._id)

  const imageUrl = product.images?.[0]?.url || 'https://placehold.co/400x300/e5e7eb/9ca3af.png?text=No+Image'
  const catColor = catColors[product.category] || 'bg-gray-100 text-gray-700'
  const isNew = new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setAdding(true)
    addToCart(product, 1)
    setTimeout(() => setAdding(false), 900)
  }

  const toggleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (isWishlisted) {
      removeFromWishlist(product._id)
    } else {
      addToWishlist(product)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-amber-200 overflow-hidden flex flex-col group transition-all duration-300 hover:-translate-y-1">

      <Link to={`/products/${product._id}`} className="block relative">
        <div className="h-52 overflow-hidden bg-gray-50">
          <img
            src={imageUrl}
            alt={product.images?.[0]?.alt || product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
            onError={(e) => { e.target.src = 'https://placehold.co/400x300/e5e7eb/9ca3af.png?text=No+Image' }}
          />
        </div>

        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isNew && <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">NEW</span>}
          {product.featured && <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">Featured</span>}
          {product.stock > 0 && product.stock < 10 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">Low Stock</span>
          )}
        </div>

        <button
          onClick={toggleWishlist}
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100">
          <svg className={`h-4 w-4 ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-400'}`} viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full self-start mb-2 ${catColor}`}>
          {product.category}
        </span>

        <Link to={`/products/${product._id}`}>
          <h3 className="font-bold text-gray-900 hover:text-amber-600 transition-colors line-clamp-2 text-sm leading-snug mb-2">
            {product.name}
          </h3>
        </Link>

        <Stars rating={product.averageRating || 0} />

        <div className="mt-auto pt-3 flex items-center justify-between">
          <div>
            <span className="text-xl font-extrabold text-gray-900">{product.price.toFixed(2)} zł</span>
            {product.featured && (
              <p className="text-xs text-green-600 font-semibold mt-0.5">Free Shipping</p>
            )}
          </div>

          {product.stock === 0 ? (
            <span className="text-xs text-red-500 font-bold bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl">Out of Stock</span>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className={`text-sm font-bold px-4 py-2 rounded-xl transition-all ${
                adding
                  ? 'bg-green-500 text-white scale-95'
                  : 'bg-amber-500 hover:bg-amber-400 text-white shadow-md shadow-amber-500/30 hover:shadow-amber-500/50 hover:-translate-y-0.5'
              }`}>
              {adding ? 'Added!' : '+ Cart'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard
