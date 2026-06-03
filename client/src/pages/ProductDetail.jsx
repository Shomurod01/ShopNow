import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { productAPI } from '../services/api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'
import { HeartIcon, StarIcon } from '../components/Icons'

const Stars = ({ rating, interactive = false, onRate }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <StarIcon 
        key={s} 
        onClick={() => interactive && onRate && onRate(s)}
        className={`h-5 w-5 ${s <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'} ${interactive ? 'cursor-pointer hover:text-yellow-400 transition-colors' : ''}`}
      />
    ))}
  </div>
)

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [selImg, setSelImg] = useState(0)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  
  const { addToCart } = useCart()
  const { user } = useAuth()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()

  const fetchProduct = async () => {
    try {
      const { data } = await productAPI.getOne(id)
      setProduct(data.product)
    } catch {
      toast.error('Product not found')
      navigate('/products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { 
    fetchProduct() 
  }, [id])

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add items to cart')
      navigate('/login')
      return
    }
    addToCart(product, qty)
  }

  const toggleWishlist = () => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id)
    } else {
      addToWishlist(product)
    }
  }

  const handleReview = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await productAPI.addReview(id, { rating: reviewRating, comment: reviewComment })
      toast.success('Review submitted!')
      setReviewComment('')
      setReviewRating(5)
      fetchProduct()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner fullPage />
  if (!product) return null

  const imgUrl = product.images?.[selImg]?.url || 'https://via.placeholder.com/500'
  const isWishlisted = isInWishlist(product._id)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-blue-600">Home</Link> /
        <Link to="/products" className="hover:text-blue-600 mx-1">Products</Link> /
        <span className="text-gray-900 ml-1 font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="h-96 bg-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <img 
              src={imgUrl} 
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/500?text=No+Image' }} 
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-3">
              {product.images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setSelImg(i)}
                  className={`h-16 w-16 rounded-xl overflow-hidden border-2 transition-colors ${i === selImg ? 'border-blue-600' : 'border-transparent hover:border-gray-300'}`}
                >
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full self-start">
            {product.category}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mt-3 leading-snug">{product.name}</h1>

          <div className="flex items-center gap-3 mt-3">
            <Stars rating={product.averageRating} />
            <span className="text-sm text-gray-500">
              {product.averageRating} · {product.numReviews} review{product.numReviews !== 1 ? 's' : ''}
            </span>
          </div>

          <p className="text-4xl font-extrabold text-gray-900 mt-4">{product.price.toFixed(2)} zł</p>
          <p className="text-gray-600 mt-4 leading-relaxed">{product.description}</p>

          <div className={`mt-4 inline-flex items-center gap-2 text-sm font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            <span className={`h-2 w-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-400'}`} />
            {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
          </div>

          <div className="flex items-center gap-4 mt-6">
            {product.stock > 0 && (
              <>
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold transition-colors">−</button>
                  <span className="px-5 py-3 font-semibold text-gray-900">{qty}</span>
                  <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold transition-colors">+</button>
                </div>
                <button onClick={handleAddToCart} className="flex-1 btn-primary py-3 text-base">
                  Add to Cart
                </button>
              </>
            )}
            <button 
              onClick={toggleWishlist} 
              className={`h-12 w-12 rounded-xl border flex items-center justify-center transition-colors ${isWishlisted ? 'border-red-500 bg-red-50 text-red-500' : 'border-gray-300 bg-white text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
            >
              <HeartIcon className={`h-6 w-6 ${isWishlisted ? 'fill-current' : ''}`} filled={isWishlisted} />
            </button>
          </div>

          {!user && (
            <p className="text-sm text-gray-500 mt-3">
              <Link to="/login" className="text-blue-600 hover:underline font-medium">Login</Link> to add items to your cart
            </p>
          )}
        </div>
      </div>

      <section className="mt-16 border-t pt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>

        {product.ratings.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-2xl">
            <p className="text-gray-500">No reviews yet. Be the first!</p>
          </div>
        ) : (
          <div className="space-y-4 mb-10">
            {product.ratings.map((r) => (
              <div key={r._id} className="card p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                    {r.user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{r.user?.name || 'User'}</p>
                    <Stars rating={r.rating} />
                  </div>
                  <span className="ml-auto text-xs text-gray-400">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {r.comment && <p className="text-gray-600 text-sm mt-1 pl-12">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}

        {user ? (
          <div className="card p-6">
            <h3 className="font-bold text-gray-900 mb-4">Write a Review</h3>
            <form onSubmit={handleReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                <Stars rating={reviewRating} interactive onRate={setReviewRating} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comment (optional)</label>
                <textarea 
                  value={reviewComment} 
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience…" 
                  rows={3} 
                  className="input-field" 
                />
              </div>
              <button type="submit" disabled={submitting} className="btn-primary px-6 py-2">
                {submitting ? 'Submitting…' : 'Submit Review'}
              </button>
            </form>
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-6 bg-gray-50 rounded-xl">
            <Link to="/login" className="text-blue-600 hover:underline font-medium">Login</Link> to leave a review
          </p>
        )}
      </section>
    </div>
  )
}

export default ProductDetail
