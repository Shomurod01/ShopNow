import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI, orderAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const STATUS_STYLES = {
  Pending:    'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Shipped:    'bg-purple-100 text-purple-800',
  Delivered:  'bg-green-100 text-green-800',
  Cancelled:  'bg-red-100 text-red-800',
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminAPI.getAllOrders()
      .then(({ data }) => setOrders(data.orders))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => o._id === orderId ? { ...o, status: newStatus } : o)
      );
      toast.success(`Order updated to "${newStatus}"`);
    } catch { toast.error('Failed to update status'); }
    finally { setUpdatingId(null); }
  };

  const filtered = orders.filter((o) => {
    const matchStatus = !filterStatus || o.status === filterStatus;
    const matchSearch = !search ||
      o._id.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalRevenue = orders.filter((o) => o.isPaid).reduce((s, o) => s + o.totalPrice, 0);

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Orders</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {orders.length} orders · Revenue: <span className="font-semibold text-green-600">{totalRevenue.toFixed(2)} zł</span>
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input type="text" placeholder="Search by order ID, name, or email…"
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="input-field sm:max-w-xs" />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="input-field sm:max-w-[160px]">
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        {(search || filterStatus) && (
          <button onClick={() => { setSearch(''); setFilterStatus(''); }}
            className="btn-secondary text-sm px-4">
            Clear
          </button>
        )}
      </div>

      {/* Status summary chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUSES.map((s) => {
          const count = orders.filter((o) => o.status === s).length;
          return (
            <button key={s} onClick={() => setFilterStatus(filterStatus === s ? '' : s)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all border ${
                filterStatus === s
                  ? STATUS_STYLES[s] + ' border-transparent shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}>
              {s} ({count})
            </button>
          );
        })}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-gray-500 text-xs uppercase tracking-wide">
                <th className="px-5 py-3">Order ID</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Items</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <Link to={`/orders/${order._id}`}
                      className="text-blue-600 hover:underline font-mono text-xs font-bold">
                      #{order._id.slice(-8).toUpperCase()}
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">{order.user?.name || 'N/A'}</p>
                      <p className="text-gray-400 text-xs truncate max-w-[140px]">{order.user?.email}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </td>
                  <td className="px-5 py-4 font-bold text-gray-900">{order.totalPrice.toFixed(2)} zł</td>
                  <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-700'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      disabled={updatingId === order._id}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {updatingId === order._id && (
                      <span className="ml-2 text-xs text-blue-500">saving…</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-400">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
