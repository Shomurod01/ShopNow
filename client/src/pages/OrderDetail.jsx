import { useState, useEffect } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { orderAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const statusStyles = {
  Pending: 'bg-yellow-100 text-yellow-800',
     Processing: 'bg-blue-100 text-blue-800',
      Shipped: 'bg-purple-100 text-purple-800',
   Delivered: 'bg-green-100 text-green-800',
      Cancelled: 'bg-red-100 text-red-800'
}

const steps = ['Pending', 'Processing', 'Shipped', 'Delivered']

const OrderDetail = () => {
   const { id } = useParams()
      const [searchParams] = useSearchParams()
   const [order, setOrder] = useState(null)
       const [loading, setLoading] = useState(true)
      const isSuccess = searchParams.get('success') === 'true'

  useEffect(() => {
    orderAPI.getOne(id)
      .then(({ data }) => setOrder(data.order))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingSpinner fullPage />
  if (!order) return (
    <div className="text-center py-24 text-gray-500">
      <p className="text-lg font-semibold">Order not found</p>
      <Link to="/orders" className="mt-4 inline-block text-blue-600 hover:underline">Back to orders</Link>
    </div>
  )

  const stepIndex = order.status === 'Cancelled' ? -1 : steps.indexOf(order.status)

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {isSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center mb-8">
        <h2 className="text-xl font-bold text-green-800">Order Placed Successfully!</h2>
            <p className="text-green-600 mt-1 text-sm">Thank you for your purchase. We'll get it ready for you.</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
          <p className="text-gray-500 text-sm font-mono mt-0.5">#{order._id.slice(-8).toUpperCase()}</p>
        </div>
        <span className={`self-start sm:self-auto px-3 py-1.5 rounded-full text-sm font-semibold ${statusStyles[order.status] || 'bg-gray-100 text-gray-700'}`}>
          {order.status}
        </span>
      </div>

      {order.status !== 'Cancelled' && (
        <div className="card p-5 mb-5">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-4 h-0.5 bg-gray-200 mx-10" />
            <div
              className="absolute left-0 top-4 h-0.5 bg-blue-500 mx-10 transition-all"
              style={{ right: `${((steps.length - 1 - stepIndex) / (steps.length - 1)) * 100}%` }}
            />
            {steps.map((step, i) => (
              <div key={step} className="flex flex-col items-center relative z-10">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                  i <= stepIndex ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {i < stepIndex ? 'v' : i + 1}
                </div>
                <span className={`text-xs mt-1.5 font-medium ${i <= stepIndex ? 'text-blue-600' : 'text-gray-400'}`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-5 mb-5">
        <h3 className="font-bold text-gray-900 mb-4">Items Ordered</h3>
        <div className="space-y-4">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <img src={item.image || 'https://via.placeholder.com/56'} alt={item.name}
                className="h-14 w-14 rounded-xl object-cover bg-gray-100 flex-shrink-0"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/56' }} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">{item.name}</p>
                <p className="text-gray-500 text-xs mt-0.5">{item.quantity} × {item.price.toFixed(2)} zł</p>
              </div>
              <p className="font-bold text-gray-900 flex-shrink-0">{(item.price * item.quantity).toFixed(2)} zł</p>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 mt-5 pt-4 space-y-2 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span><span>{order.itemsPrice.toFixed(2)} zł</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Shipping</span>
            {order.shippingPrice === 0
              ? <span className="text-green-600 font-medium">Free</span>
              : <span>{order.shippingPrice.toFixed(2)} zł</span>}
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Tax</span><span>{order.taxPrice.toFixed(2)} zł</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100">
            <span>Total</span><span>{order.totalPrice.toFixed(2)} zł</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
        <div className="card p-5">
          <h3 className="font-bold text-gray-900 mb-3">Shipping Address</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p className="font-semibold text-gray-900">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
            <p>{order.shippingAddress.country}</p>
            {order.shippingAddress.phone && <p>{order.shippingAddress.phone}</p>}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-bold text-gray-900 mb-3">Payment</h3>
          <div className="text-sm text-gray-600 space-y-1.5">
            <p>Method: <span className="font-medium capitalize">{order.paymentMethod}</span></p>
            <p className={`font-semibold ${order.isPaid ? 'text-green-600' : 'text-red-500'}`}>
              {order.isPaid
                ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}`
                : 'Payment pending'}
            </p>
            {order.paymentResult?.id && (
              <p className="text-xs text-gray-400 font-mono break-all">ID: {order.paymentResult.id}</p>
            )}
            {order.isDelivered && (
              <p className="text-green-600 font-semibold">
                Delivered {new Date(order.deliveredAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/orders" className="btn-secondary flex-1 text-center py-3">My Orders</Link>
        <Link to="/products" className="btn-primary flex-1 text-center py-3">Continue Shopping</Link>
      </div>
    </div>
  )
}

export default OrderDetail
