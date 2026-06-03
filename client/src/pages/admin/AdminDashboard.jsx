import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const STATUS_STYLES = {
  Pending:    'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Shipped:    'bg-purple-100 text-purple-800',
  Delivered:  'bg-green-100 text-green-800',
  Cancelled:  'bg-red-100 text-red-800',
};

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats()
      .then(({ data: res }) => setData(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullPage />;

  const cards = [
    { label: 'Total Products', value: data?.stats.totalProducts, bg: 'bg-blue-50', text: 'text-blue-700', link: '/admin/products' },
     { label: 'Total Orders',   value: data?.stats.totalOrders, bg: 'bg-purple-50', text: 'text-purple-700', link: '/admin/orders' },
       { label: 'Total Customers',value: data?.stats.totalUsers, bg: 'bg-green-50',  text: 'text-green-700',  link: '#' },
    { label: 'Total Revenue',  value: `${(data?.stats.totalRevenue || 0).toFixed(2)} zł`, bg: 'bg-yellow-50', text: 'text-yellow-700', link: '#' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Welcome back! Here's what's happening.</p>
        </div>
        <span className="text-xs bg-purple-100 text-purple-700 font-semibold px-3 py-1.5 rounded-full">Admin Mode</span>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <Link key={card.label} to={card.link}
            className={`${card.bg} card p-5 hover:shadow-md transition-shadow`}>
            <div className="text-3xl mb-3"></div>
            <p className={`text-2xl font-extrabold ${card.text}`}>{card.value}</p>
            <p className="text-sm text-gray-600 mt-1 font-medium">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link to="/admin/orders"
          className="card p-5 flex items-center gap-4 hover:shadow-md transition-shadow group">
          <div className="h-14 w-14 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
            
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Manage Orders</h3>
            <p className="text-sm text-gray-500">View and update order statuses</p>
          </div>
          <svg className="h-5 w-5 text-gray-400 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Recent orders table */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm text-blue-600 hover:underline font-medium">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-500 text-xs uppercase tracking-wide">
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data?.recentOrders?.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <Link to={`/orders/${order._id}`}
                      className="text-blue-600 hover:underline font-mono text-xs font-bold">
                      #{order._id.slice(-8).toUpperCase()}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{order.user?.name || 'N/A'}</p>
                      <p className="text-gray-400 text-xs">{order.user?.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{order.totalPrice.toFixed(2)} zł</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-700'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
