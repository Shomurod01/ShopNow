import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { orderAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const statusStyles = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-purple-100 text-purple-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800'
}

const statusIcons = {
  Pending: '',
  Processing: '',
  Shipped: '',
  Delivered: '',
  Cancelled: ''
}

const OrderHistory = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    orderAPI.getMyOrders()
      .then(({ data }) => setOrders(data.orders))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner fullPage />

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zm0 12H4V9h16v10zm-8-8a3 3 0 100 6 3 3 0 000-6zm0 4a1 1 0 110-2 1 1 0 010 2zM8 5h8V3H8v2z"/></svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-8">When you place an order it will appear here.</p>
          <Link to="/products" className="btn-primary px-8 py-3 text-base">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-bold text-gray-900">
                      #{order._id.slice(-8).toUpperCase()}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyles[order.status] || 'bg-gray-100 text-gray-700'}`}>
                      {statusIcons[order.status]} {order.status}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                  <p className="font-bold text-gray-900 mt-1">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''} ·{' '}
                    <span className="text-blue-600">{order.totalPrice.toFixed(2)} zł</span>
                  </p>
                </div>
                <Link to={`/orders/${order._id}`}
                  className="btn-secondary text-sm px-4 py-2 self-start whitespace-nowrap">
                  View Details →
                </Link>
              </div>

              <div className="flex items-center gap-2 mt-4">
                {order.items.slice(0, 5).map((item, i) => (
                  <div key={i} className="relative">
                    <img src={item.image || 'https://via.placeholder.com/44'}
                      alt={item.name}
                      title={item.name}
                      className="h-11 w-11 rounded-lg object-cover border border-gray-100"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/44' }} />
                  </div>
                ))}
                {order.items.length > 5 && (
                  <div className="h-11 w-11 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500 border border-gray-100">
                    +{order.items.length - 5}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrderHistory
