import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

const categories = ['Electronics', 'Clothing', 'Books', 'Sports', 'Home & Garden', 'Toys']

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth()
   const { cartCount } = useCart()
   const { wishlist } = useWishlist()
    const navigate = useNavigate()
     const [menuOpen, setMenuOpen] = useState(false)
     const [dropdownOpen, setDropdownOpen] = useState(false)
   const [searchQuery, setSearchQuery] = useState('')

  const handleLogout = async () => {
     setDropdownOpen(false)
        setMenuOpen(false)
     await logout()
       navigate('/')
  }

  const handleSearch = (e) => {
    e.preventDefault()
       if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className="sticky top-0 z-50">


      <nav className="bg-slate-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">

            <Link to="/" className="flex-shrink-0 text-2xl font-extrabold tracking-tight ml-4">
              <span className="text-white">Shop</span><span className="text-amber-400">Now</span>
            </Link>

            {!isAdmin && (
              <form onSubmit={handleSearch} className="flex-1 hidden sm:flex max-w-2xl">
                <input
                  type="text"
                  value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                     placeholder="Search products, brands and categories..."
                  className="flex-1 px-4 py-2 text-sm text-gray-900 bg-white rounded-l-lg focus:outline-none"
                />
                <button type="submit" className="bg-amber-500 hover:bg-amber-400 px-4 rounded-r-lg transition-colors">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            )}

            <div className="hidden md:flex items-center gap-5">
              {!isAdmin && (
                <>
                  <Link to="/wishlist" className="relative flex flex-col items-center text-gray-300 hover:text-amber-400 transition-colors">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {wishlist?.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        {wishlist.length > 9 ? '9+' : wishlist.length}
                      </span>
                    )}
                    <span className="text-xs mt-0.5">Wishlist</span>
                  </Link>

                  <Link to="/cart" className="relative flex flex-col items-center text-gray-300 hover:text-amber-400 transition-colors">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        {cartCount > 9 ? '9+' : cartCount}
                      </span>
                    )}
                    <span className="text-xs mt-0.5">Cart</span>
                  </Link>
                </>
              )}

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 text-gray-300 hover:text-amber-400 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left">
                         <p className="text-xs text-gray-400">Hello,</p>
                      <p className="text-sm font-semibold leading-none">{user.name.split(' ')[0]}</p>
                    </div>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <>
                       <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                      <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-xl shadow-2xl py-2 z-20 border border-gray-100">
                           <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-bold truncate">{user.name}</p>
                             <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50">👤 My Profile</Link>
                        {!isAdmin && (
                          <>
                            <Link to="/orders" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50">📦 My Orders</Link>
                            <Link to="/wishlist" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50">❤️ My Wishlist</Link>
                          </>
                        )}
                        {isAdmin && (
                          <Link to="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-amber-600 hover:bg-amber-50 font-semibold">⚙️ Admin Dashboard</Link>
                        )}
                        <hr className="my-1 border-gray-100" />
                        <button onClick={handleLogout} className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">🚪 Logout</button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                     <Link to="/login" className="text-gray-300 hover:text-amber-400 font-medium text-sm">Login</Link>
                  <Link to="/register" className="bg-amber-500 hover:bg-amber-400 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">Sign Up</Link>
                </div>
              )}
            </div>

            {/* mobile buttons */}
            <div className="flex items-center gap-3 md:hidden ml-auto">
              {!isAdmin && (
                <>
                  <Link to="/wishlist" className="relative text-gray-300">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {wishlist?.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">{wishlist.length}</span>
                    )}
                  </Link>

                  <Link to="/cart" className="relative text-gray-300">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">{cartCount}</span>
                    )}
                  </Link>
                </>
              )}
              <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-300">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {menuOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* categories row */}
        {!isAdmin && (
          <div className="bg-slate-800 border-t border-slate-700 hidden md:block">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-6 h-9 text-xs overflow-x-auto">
              <Link to="/products" className="text-gray-200 hover:text-amber-400 whitespace-nowrap font-bold transition-colors">🛍️ All Products</Link>
              {categories.map(cat => (
                <Link key={cat} to={`/products?category=${encodeURIComponent(cat)}`}
                  className="text-gray-400 hover:text-amber-400 whitespace-nowrap transition-colors">{cat}</Link>
              ))}
              <Link to="/products?sort=-createdAt" className="text-amber-400 font-semibold whitespace-nowrap ml-auto">⚡ New Arrivals</Link>
            </div>
          </div>
        )}

        {menuOpen && (
          <div className="md:hidden bg-slate-800 border-t border-slate-700 px-4 py-3 space-y-1">
            {!isAdmin && (
              <form onSubmit={handleSearch} className="flex mb-3">
                    <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search..." className="flex-1 px-3 py-2 text-sm text-gray-900 rounded-l-lg focus:outline-none" />
                <button type="submit" className="bg-amber-500 px-3 rounded-r-lg">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            )}
            {!isAdmin && (
              <Link to="/products" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-200 hover:text-amber-400 font-medium">All Products</Link>
            )}
            {user ? (
              <>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-400 hover:text-amber-400">My Profile</Link>
                {!isAdmin && (
                  <>
                    <Link to="/orders" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-400 hover:text-amber-400">My Orders</Link>
                    <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-400 hover:text-amber-400">My Wishlist</Link>
                  </>
                )}
                {isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)} className="block py-2 text-amber-400 font-semibold">Admin Dashboard</Link>}
                <button onClick={handleLogout} className="block w-full text-left py-2 text-red-400">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-400 hover:text-amber-400">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="block py-2 text-amber-400 font-semibold">Sign Up Free</Link>
              </>
            )}
          </div>
        )}
      </nav>
    </div>
  )
}

export default Navbar
