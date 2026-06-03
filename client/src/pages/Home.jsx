import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { productAPI } from '../services/api'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { CATEGORY_NAMES, FEATURES, BRANDS } from '../utils/constants'

const HeroSection = () => (
  <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 rounded-full px-4 py-1.5 text-amber-300 text-sm font-semibold mb-6">
            Summer Sale — Up to 70% Off
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Discover &amp; <span className="text-amber-400">Shop</span>
            <br />What You Love
          </h1>
          <p className="text-lg text-slate-300 mb-8 max-w-md leading-relaxed">
            Millions of products. Unbeatable prices. Fast delivery to your door.
            Join <strong className="text-white">10 million+</strong> happy shoppers today.
          </p>
          <div className="flex flex-wrap gap-4 mb-12">
            <Link to="/products" className="bg-amber-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-amber-500/30">
              Shop Now →
            </Link>
            <Link to="/register" className="border-2 border-white/30 hover:border-white/60 hover:bg-white/10 text-white font-semibold px-8 py-3.5 rounded-xl transition-all">
              Create Free Account
            </Link>
          </div>
        </div>

        <div className="hidden lg:flex flex-col gap-4 relative">
          <div className="flex gap-4">
            <div className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 flex items-center gap-4 hover:bg-white/15 transition-all hover:-translate-y-1 duration-300 cursor-default">
              <div>
                <p className="font-bold text-white text-sm">Electronics</p>
                <p className="text-xs text-slate-400">1,200+ products</p>
              </div>
            </div>
            <div className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 flex items-center gap-4 hover:bg-white/15 transition-all hover:-translate-y-1 duration-300 cursor-default">
              <div>
                <p className="font-bold text-white text-sm">Fashion</p>
                <p className="text-xs text-slate-400">3,400+ styles</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-400/30 rounded-2xl p-6 flex items-center gap-5 hover:from-amber-500/30 hover:to-orange-500/30 transition-all duration-300 cursor-default">
            <div className="flex-1">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Featured Pick</span>
              <p className="font-extrabold text-white text-lg mt-0.5">Noise-Cancelling Headphones</p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex gap-0.5"><span className="text-amber-400 text-sm font-bold">5.0</span></div>
                <span className="text-amber-300 font-black text-lg">299.99 zł</span>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 flex items-center gap-4 hover:bg-white/15 transition-all hover:-translate-y-1 duration-300 cursor-default">
              <div>
                <p className="font-bold text-white text-sm">Sports</p>
                <p className="text-xs text-slate-400">800+ items</p>
              </div>
            </div>
            <div className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 flex items-center gap-4 hover:bg-white/15 transition-all hover:-translate-y-1 duration-300 cursor-default">
              <div>
                <p className="font-bold text-white text-sm">Home & Garden</p>
                <p className="text-xs text-slate-400">2,100+ products</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
)

const FeaturesStrip = () => (
  <section className="bg-white border-b border-gray-100 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
        {FEATURES.map((f) => (
          <div key={f.title} className="flex items-center gap-3 py-4 px-4 md:px-6">
            <div>
              <p className="font-bold text-gray-900 text-sm">{f.title}</p>
              <p className="text-xs text-gray-500">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

const CategorySection = () => (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
    <div className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Shop by Category</h2>
        <p className="text-gray-500 mt-1">Find exactly what you're looking for</p>
      </div>
      <Link to="/products" className="text-amber-600 hover:text-amber-700 font-semibold text-sm flex items-center gap-1">
        View all →
      </Link>
    </div>
    <div className="flex flex-wrap gap-3">
      {CATEGORY_NAMES.map((name) => (
        <Link key={name} to={`/products?category=${encodeURIComponent(name)}`}
          className="px-6 py-2.5 rounded-full border border-gray-200 text-gray-700 font-medium text-sm hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all duration-200">
          {name}
        </Link>
      ))}
    </div>
  </section>
)

const PromoBanners = () => (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
    <div className="grid md:grid-cols-2 gap-6">
      <Link to="/products?category=Electronics"
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white group hover:shadow-2xl transition-all hover:-translate-y-1">
        <p className="text-blue-200 text-sm font-semibold mb-2">Up to 50% Off</p>
        <h3 className="text-2xl font-extrabold mb-2">Tech &amp; Electronics</h3>
        <p className="text-blue-200 text-sm mb-4">Latest gadgets at unbeatable prices</p>
        <span className="inline-block bg-white text-blue-700 font-bold px-5 py-2 rounded-xl text-sm group-hover:bg-blue-50 transition-colors">
          Shop Electronics
        </span>
      </Link>
      <Link to="/products?category=Clothing"
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 p-8 text-white group hover:shadow-2xl transition-all hover:-translate-y-1">
        <p className="text-pink-200 text-sm font-semibold mb-2">New Season Collection</p>
        <h3 className="text-2xl font-extrabold mb-2">Fashion &amp; Clothing</h3>
        <p className="text-pink-200 text-sm mb-4">Trending styles delivered to you</p>
        <span className="inline-block bg-white text-pink-600 font-bold px-5 py-2 rounded-xl text-sm group-hover:bg-pink-50 transition-colors">
          Shop Fashion
        </span>
      </Link>
    </div>
  </section>
)

const TrustStrip = () => (
  <section className="bg-amber-500 py-4">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-white text-sm font-semibold">
        <span>100% Authentic Products</span>
        <span>Buyer Protection</span>
        <span>Secure Checkout</span>
        <span>Fast Delivery</span>
        <span>4.9/5 Rating</span>
      </div>
    </div>
  </section>
)

const Home = () => {
  const [featured, setFeatured] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    Promise.all([
      productAPI.getAll({ featured: 'true', limit: 4 }),
      productAPI.getAll({ limit: 8 })
    ])
      .then(([featRes, newRes]) => {
        setFeatured(featRes.data.products || [])
        setNewArrivals(newRes.data.products || [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email.trim()) setSubscribed(true)
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <HeroSection />
      <FeaturesStrip />
      <CategorySection />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Featured Products</h2>
            <p className="text-gray-500 mt-1">Hand-picked top-rated items just for you</p>
          </div>
          <Link to="/products?featured=true" className="text-amber-600 hover:text-amber-700 font-semibold text-sm">View all →</Link>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">No featured products yet.</div>
        )}
      </section>

      <PromoBanners />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">New Arrivals</h2>
            <p className="text-gray-500 mt-1">Fresh products added just for you</p>
          </div>
          <Link to="/products" className="text-amber-600 hover:text-amber-700 font-semibold text-sm">View all →</Link>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : newArrivals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.slice(0, 8).map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">No products available yet.</div>
        )}
        <div className="text-center mt-10">
          <Link to="/products" className="inline-block bg-amber-500 hover:bg-amber-400 text-white font-bold px-10 py-3.5 rounded-xl shadow-lg shadow-amber-500/30 hover:-translate-y-0.5 transition-all">
            Browse All Products →
          </Link>
        </div>
      </section>

      <section className="bg-white border-y border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-8">Trusted Brands on ShopNow</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {BRANDS.map((b) => (
              <div key={b.name} className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 hover:bg-amber-50 hover:shadow-md transition-all cursor-pointer group">
                <span className="text-xs font-bold text-gray-600 group-hover:text-amber-700">{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-slate-900 to-indigo-900 py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-3">Get Exclusive Deals</h2>
          <p className="text-slate-400 mb-8">Subscribe to our newsletter and be the first to know about new arrivals, flash sales, and special discounts.</p>
          {subscribed ? (
            <div className="bg-green-500/20 border border-green-500/30 rounded-2xl px-8 py-6 text-green-400 font-semibold text-lg">
              You're subscribed! Check your inbox for a welcome discount.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:bg-white/15 transition-all"
              />
              <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-amber-500/30 whitespace-nowrap">
                Subscribe →
              </button>
            </form>
          )}
          <p className="text-slate-500 text-xs mt-4">No spam, unsubscribe anytime. We respect your privacy.</p>
        </div>
      </section>

      <TrustStrip />
    </div>
  )
}

export default Home
