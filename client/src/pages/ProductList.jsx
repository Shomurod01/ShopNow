import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { productAPI } from '../services/api'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'

const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys', 'Other']

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(true)

  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const sort = searchParams.get('sort') || '-createdAt'
  const page = Number(searchParams.get('page')) || 1
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit: 12, sort }
      if (search) params.search = search
      if (category) params.category = category
      if (minPrice) params.minPrice = minPrice
      if (maxPrice) params.maxPrice = maxPrice
      const { data } = await productAPI.getAll(params)
      setProducts(data.products)
      setPagination(data.pagination)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [search, category, sort, page, minPrice, maxPrice])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const setParam = (key, value) => {
    const p = Object.fromEntries(searchParams.entries())
    if (value) p[key] = value
    else delete p[key]
    if (key !== 'page') p.page = '1'
    setSearchParams(p)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">All Products</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-60 space-y-4 flex-shrink-0">
          <div className="card p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
            <input type="text" placeholder="Search products…" value={search}
              onChange={(e) => setParam('search', e.target.value)} className="input-field text-sm" />
          </div>

          <div className="card p-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">Category</p>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="cat" checked={!category} onChange={() => setParam('category', '')} />
                <span className="text-sm text-gray-700">All</span>
              </label>
              {categories.map((c) => (
                <label key={c} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="cat" checked={category === c} onChange={() => setParam('category', c)} />
                  <span className="text-sm text-gray-700">{c}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Price Range</p>
            <div className="flex gap-2 items-center">
              <input type="number" placeholder="Min" value={minPrice}
                onChange={(e) => setParam('minPrice', e.target.value)}
                className="input-field text-sm w-1/2" min="0" />
              <span className="text-gray-400 text-sm">–</span>
              <input type="number" placeholder="Max" value={maxPrice}
                onChange={(e) => setParam('maxPrice', e.target.value)}
                className="input-field text-sm w-1/2" min="0" />
            </div>
          </div>

          <div className="card p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
            <select value={sort} onChange={(e) => setParam('sort', e.target.value)} className="input-field text-sm">
              <option value="-createdAt">Newest First</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="-averageRating">Top Rated</option>
            </select>
          </div>

          {(search || category || minPrice || maxPrice) && (
            <button onClick={() => setSearchParams({})} className="w-full btn-secondary text-sm py-2">
              Clear All Filters
            </button>
          )}
        </aside>

        <div className="flex-1">
          {loading ? <LoadingSpinner /> : products.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4"></div>
              <p className="text-xl font-semibold text-gray-700">No products found</p>
              <p className="text-gray-500 mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">
                {pagination.total} product{pagination.total !== 1 ? 's' : ''} found
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>

              {pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  <button disabled={page === 1} onClick={() => setParam('page', String(page - 1))}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:bg-gray-50">
                    ← Prev
                  </button>
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                    <button key={p} onClick={() => setParam('page', String(p))}
                      className={`h-9 w-9 rounded-lg text-sm font-medium ${p === page ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                      {p}
                    </button>
                  ))}
                  <button disabled={page === pagination.pages} onClick={() => setParam('page', String(page + 1))}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:bg-gray-50">
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductList
