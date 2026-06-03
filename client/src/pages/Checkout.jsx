import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useCart } from '../context/CartContext'
import { paymentAPI, orderAPI } from '../services/api'
import toast from 'react-hot-toast'

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''
const isDummyStripeKey = stripeKey.includes('YOUR_STRIPE') || !stripeKey
const stripePromise = !isDummyStripeKey ? loadStripe(stripeKey) : null

const Steps = ({ current }) => {
  const steps = ['Shipping', 'Payment', 'Done']
  return (
    <div className="flex items-center justify-center mb-10">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center">
          <div className={`flex items-center justify-center h-9 w-9 rounded-full text-sm font-bold transition-colors ${
            i < current ? 'bg-green-500 text-white' : i === current ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
            {i < current ? 'v' : i + 1}
          </div>
          <span className={`ml-2 text-sm font-medium hidden sm:block ${i === current ? 'text-gray-900' : 'text-gray-400'}`}>
            {step}
          </span>
          {i < steps.length - 1 && (
            <div className={`w-12 sm:w-20 h-0.5 mx-3 transition-colors ${i < current ? 'bg-green-400' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

const PaymentForm = ({ shippingAddress, cartItems, onSuccess }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setProcessing(true)

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required'
      })

      if (error) {
        toast.error(error.message)
        setProcessing(false)
        return
      }

      if (paymentIntent?.status === 'succeeded') {
        const orderData = {
          items: cartItems.map((item) => ({
            product: item.product?._id || item.product,
            name: item.product?.name || item.name,
            quantity: item.quantity,
            price: item.price,
            image: item.product?.images?.[0]?.url || ''
          })),
          shippingAddress,
          paymentMethod: 'stripe',
          paymentResult: {
            id: paymentIntent.id,
            status: paymentIntent.status,
            updateTime: new Date().toISOString()
          }
        }
        const { data } = await orderAPI.create(orderData)
        onSuccess(data.order._id)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed. Please try again.')
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700">
         <strong>Test mode</strong> — Use card <code className="bg-blue-100 px-1 rounded">4242 4242 4242 4242</code>, any future expiry, any CVC
      </div>
      <PaymentElement />
      <button type="submit" disabled={!stripe || processing}
        className="btn-primary w-full py-3 text-base font-semibold">
        {processing ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Processing…
          </span>
        ) : ' Place Order & Pay'}
      </button>
    </form>
  )
}

const Checkout = () => {
  const [step, setStep] = useState(0)
  const [shippingData, setShippingData] = useState(null)
  const [clientSecret, setClientSecret] = useState('')
  const [loadingIntent, setLoadingIntent] = useState(false)
  const { cartItems, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()

  useEffect(() => {
    if (cartItems.length === 0) navigate('/cart')
  }, [cartItems])

  const onShipping = async (data) => {
    setShippingData(data)
    setLoadingIntent(true)

    if (isDummyStripeKey) {
      setTimeout(() => {
        setClientSecret('dummy_secret')
        setStep(1)
        setLoadingIntent(false)
      }, 300)
      return
    }

    try {
      const { data: intent } = await paymentAPI.createIntent({ items: cartItems })
      setClientSecret(intent.clientSecret)
      setStep(1)
    } catch {
      toast.error('Failed to initialize payment. Check your Stripe key.')
    } finally {
      setLoadingIntent(false)
    }
  }

  const onSuccess = (orderId) => {
    clearCart()
    navigate(`/orders/${orderId}?success=true`)
  }

  const shipping = cartTotal > 100 ? 0 : 9.99
  const tax = Math.round(cartTotal * 0.08 * 100) / 100
  const total = cartTotal + shipping + tax

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Checkout</h1>
      <Steps current={step} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          {step === 0 && (
            <div className="card p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Shipping Address</h2>
              <form onSubmit={handleSubmit(onShipping)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input {...register('fullName', { required: 'Full name is required' })} className="input-field" placeholder="Jan Kowalski" />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                  <input {...register('street', { required: 'Street is required' })} className="input-field" placeholder="ul. Marszałkowska 1" />
                  {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input {...register('city', { required: 'City is required' })} className="input-field" placeholder="Warszawa" />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
                    <input {...register('postalCode', { required: 'Postal code is required' })} className="input-field" placeholder="00-001" />
                    {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                  <input {...register('country', { required: 'Country is required' })} defaultValue="Poland" className="input-field" />
                  {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input {...register('phone')} className="input-field" placeholder="+48 500 000 000" />
                </div>
                <button type="submit" disabled={loadingIntent} className="btn-primary w-full py-3 text-base">
                  {loadingIntent ? 'Preparing…' : 'Continue to Payment →'}
                </button>
              </form>
            </div>
          )}

          {step === 1 && clientSecret && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900">Payment Details</h2>
                <button onClick={() => setStep(0)} className="text-sm text-blue-600 hover:underline">← Back</button>
              </div>

              {isDummyStripeKey ? (
                <div className="space-y-6">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-800">
                     <strong>Development Mode</strong> — You are using a dummy Stripe key. No real payment will be processed.
                  </div>
                  <button onClick={() => {
                    const orderData = {
                      items: cartItems.map((item) => ({
                        product: item.product?._id || item.product,
                        name: item.product?.name || item.name,
                        quantity: item.quantity,
                        price: item.price,
                        image: item.product?.images?.[0]?.url || ''
                      })),
                      shippingAddress: shippingData,
                      paymentMethod: 'mock',
                      paymentResult: {
                        id: 'mock_tx_' + Date.now(),
                        status: 'succeeded',
                        updateTime: new Date().toISOString()
                      }
                    }
                    orderAPI.create(orderData)
                      .then(res => onSuccess(res.data.order._id))
                      .catch(err => toast.error('Error creating order'))
                  }} className="btn-primary w-full py-3 text-base font-semibold">
                    Simulate Successful Payment
                  </button>
                </div>
              ) : (
                <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                  <PaymentForm shippingAddress={shippingData} cartItems={cartItems} onSuccess={onSuccess} />
                </Elements>
              )}
            </div>
          )}
        </div>

        {/* order summary sidebar */}
        <div className="lg:col-span-2">
          <div className="card p-5 sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate flex-1 mr-2">
                    {item.product?.name || item.name} × {item.quantity}
                  </span>
                  <span className="font-medium flex-shrink-0">{(item.price * item.quantity).toFixed(2)} zł</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span><span>{cartTotal.toFixed(2)} zł</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                {shipping === 0 ? <span className="text-green-600 font-medium">Free</span> : <span>{shipping.toFixed(2)} zł</span>}
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Tax (8%)</span><span>{tax.toFixed(2)} zł</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t">
                <span>Total</span><span>{total.toFixed(2)} zł</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
