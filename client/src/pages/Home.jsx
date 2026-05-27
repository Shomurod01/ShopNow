import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { productAPI } from '../services/api'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'

const categories = [
  { name: 'Electronics', gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50', desc: '1,200+ Products' },
  { name: 'Clothing', gradient: 'from-pink-500 to-rose-500', bg: 'bg-pink-50', desc: '3,400+ Styles' },
  { name: 'Books', gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', desc: '5,000+ Titles' },
  { name: 'Sports', gradient: 'from-green-500 to-emerald-500', bg: 'bg-green-50', desc: '800+ Items' },
  { name: 'Home & Garden', gradient: 'from-purple-500 to-violet-500', bg: 'bg-purple-50', desc: '2,100+ Products' },
  { name: 'Toys', gradient: 'from-red-500 to-orange-500', bg: 'bg-red-50', desc: '600+ Toys' }
]

const stats = [
  { value: '10M+', label: 'Happy Customers' },
  { value: '500K+', label: 'Products' },
  { value: '150+', label: 'Countries Shipped' },
  { value: '99%', label: 'Satisfaction Rate' }
]

const features = [
  { title: 'Free Shipping', desc: 'On all orders over $50' },
  { title: 'Secure Payments', desc: '256-bit SSL encryption' },
  { title: '30-Day Returns', desc: 'No questions asked' },
  { title: '24/7 Support', desc: 'Always here for you' }
]



const brands = [
  { name: 'TechPro' },
  { name: 'StyleCo' },
  { name: 'SportsFit' },
  { name: 'HomeStyle' },
  { name: 'BookWorld' },
  { name: 'ToyLand' }
]

const pad = (n) => String(n).padStart(2, '0')

const Home = () => {
  const [featured, setFeatured] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState({ h: 5, m: 47, s: 33 })
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const navigate = useNavigate()

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

  // countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { h, m, s } = prev
        if (s > 0) return { h, m, s: s - 1 }
        if (m > 0) return { h, m: m - 1, s: 59 }
        if (h > 0) return { h: h - 1, m: 59, s: 59 }
        return { h: 5, m: 47, s: 33 } // reset
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email.trim()) setSubscribed(true)
  }

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white relative overflow-hidden">
        {/* animated blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 rounded-full px-4 py-1.5 text-amber-300 text-sm font-semibold mb-6">
                Summer Sale — Up to 70% Off
              </span>
              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
                Discover &amp;{' '}
                <span className="text-amber-400">Shop</span>
                <br />What You Love
              </h1>
              <p className="text-lg text-slate-300 mb-8 max-w-md leading-relaxed">
                Millions of products. Unbeatable prices. Fast delivery to your door.
                Join <strong className="text-white">10 million+</strong> happy shoppers today.
              </p>
              <div className="flex flex-wrap gap-4 mb-12">
                <Link to="/products"
                  className="bg-amber-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-amber-500/30">
                  Shop Now →
                </Link>
                <Link to="/register"
                  className="border-2 border-white/30 hover:border-white/60 hover:bg-white/10 text-white font-semibold px-8 py-3.5 rounded-xl transition-all">
                  Create Free Account
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10">
                {stats.map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-2xl font-extrabold text-amber-400">{s.value}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* modern animated hero visual */}
            <div className="hidden lg:flex flex-col gap-4 relative">
              {/* top row cards */}
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

              {/* middle big card */}
              <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-400/30 rounded-2xl p-6 flex items-center gap-5 hover:from-amber-500/30 hover:to-orange-500/30 transition-all duration-300 cursor-default">

                <div className="flex-1">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Featured Pick</span>
                  <p className="font-extrabold text-white text-lg mt-0.5">Noise-Cancelling Headphones</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex gap-0.5">{'★★★★★'.split('').map((s, i) => <span key={i} className="text-amber-400 text-sm">{s}</span>)}</div>
                    <span className="text-amber-300 font-black text-lg">299.99 zł</span>
                  </div>
                </div>
              </div>

              {/* bottom row */}
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

      {/* features bar */}
      <section className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {features.map((f) => (
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

      {/* categories */}
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link key={cat.name} to={`/products?category=${encodeURIComponent(cat.name)}`}
              className={`group ${cat.bg} rounded-2xl p-5 text-center border border-transparent hover:border-gray-200 hover:shadow-xl transition-all hover:-translate-y-1 duration-200`}>
              <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${cat.gradient} mb-3 shadow-md group-hover:scale-110 transition-transform`} />
              <p className="font-bold text-gray-800 text-sm">{cat.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* flash deals */}
      <section className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-white">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-black text-2xl md:text-3xl uppercase tracking-wider">Flash Deals</span>
              </div>
              <p className="text-red-100 text-sm">Limited time offers — Grab them before they're gone!</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <span className="text-red-200 text-sm">Ends in:</span>
              {[pad(timeLeft.h), pad(timeLeft.m), pad(timeLeft.s)].map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="bg-white rounded-xl px-4 py-2 text-center min-w-[56px] shadow-lg">
                    <div className="text-2xl font-black text-red-600 leading-none">{t}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{['HRS', 'MIN', 'SEC'][i]}</div>
                  </div>
                  {i < 2 && <span className="text-white text-2xl font-bold">:</span>}
                </div>
              ))}
              <Link to="/products" className="bg-white text-red-600 font-bold px-6 py-3 rounded-xl hover:bg-red-50 transition-colors shadow-lg ml-2">
                Shop Deals →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* featured products */}
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

      {/* promo banners */}
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

      {/* new arrivals */}
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
          <Link to="/products"
            className="inline-block bg-amber-500 hover:bg-amber-400 text-white font-bold px-10 py-3.5 rounded-xl shadow-lg shadow-amber-500/30 hover:-translate-y-0.5 transition-all">
            Browse All Products →
          </Link>
        </div>
      </section>

      {/* brands */}
      <section className="bg-white border-y border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-8">Trusted Brands on ShopNow</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {brands.map((b) => (
              <div key={b.name}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 hover:bg-amber-50 hover:shadow-md transition-all cursor-pointer group">
                <span className="text-xs font-bold text-gray-600 group-hover:text-amber-700">{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* newsletter */}
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
              <button type="submit"
                className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-amber-500/30 whitespace-nowrap">
                Subscribe →
              </button>
            </form>
          )}
          <p className="text-slate-500 text-xs mt-4">No spam, unsubscribe anytime.  We respect your privacy.</p>
        </div>
      </section>

      {/* bottom trust strip */}
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
    </div>
  )
}

export default Home
