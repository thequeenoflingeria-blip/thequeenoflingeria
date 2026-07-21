'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  checkAuth, getOrders, getDashboardStats,
  loginAdmin, logoutAdmin, updateOrderStatus
} from './actions'

// ─── Types ─────────────────────────────────────────────────────────
interface Order {
  _id: string
  _createdAt: string
  orderNumber?: string
  customerName: string
  phone: string
  address: string
  deliveryType: string
  totalAmount: number
  status: string
  wilayaName: string
  items?: { quantity: number; size: string; color: string; productName: string }[]
}

interface Stats {
  total: number
  pending: number
  delivered: number
  todayOrders: number
  totalRevenue: number
}

// ─── Status Config ─────────────────────────────────────────────────
const STATUS = {
  pending:   { label: 'قيد الانتظار', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  confirmed: { label: 'تم التأكيد',   color: 'bg-blue-100 text-blue-800 border-blue-200' },
  shipped:   { label: 'قيد التوصيل', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  delivered: { label: 'تم التوصيل',  color: 'bg-green-100 text-green-800 border-green-200' },
  cancelled: { label: 'ملغى',        color: 'bg-red-100 text-red-800 border-red-200' },
} as const

// ─── Login Page ────────────────────────────────────────────────────
function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [locked, setLocked] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (locked) return
    setError('')
    setLoading(true)
    try {
      const res = await loginAdmin(username.trim(), password)
      if (res.success) {
        onLogin()
      } else {
        setError(res.error || 'خطأ في تسجيل الدخول')
        if (res.locked) setLocked(true)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-rose-600 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-rose-200">
            <span className="text-white text-2xl">👑</span>
          </div>
          <h1 className="text-2xl font-black text-rose-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            the queen of lingerie
          </h1>
          <p className="text-rose-500 mt-1 text-sm font-medium">لوحة تحكم الإدارة</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-rose-100 p-8 border border-rose-50">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">تسجيل الدخول</h2>
          
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                👤 اسم المستخدم
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none transition-all text-gray-800 font-medium"
                placeholder="admin"
                autoComplete="username"
                disabled={locked}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                🔐 كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none transition-all text-gray-800 font-medium pe-12"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={locked}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`p-3 rounded-xl text-sm font-medium text-center ${locked ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-orange-50 text-orange-700 border border-orange-200'}`}
                >
                  {locked ? '🔒 ' : '⚠️ '}{error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Button */}
            <button
              type="submit"
              disabled={loading || locked}
              className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg ${
                locked
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-rose-600 to-pink-500 text-white hover:from-rose-700 hover:to-pink-600 shadow-rose-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  جاري التحقق...
                </span>
              ) : locked ? '🔒 الحساب مقفل مؤقتاً' : 'دخول →'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-rose-400 mt-6">
          🔒 هذه الصفحة محمية ومشفرة
        </p>
      </motion.div>
    </div>
  )
}

// ─── Stats Card ─────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4`}
    >
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-xl flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-black text-gray-900">{value}</p>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  )
}

// ─── Main Dashboard ─────────────────────────────────────────────────
function Dashboard({ username, onLogout }: { username: string; onLogout: () => void }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const [ordersData, statsData] = await Promise.all([getOrders(), getDashboardStats()])
    setOrders(ordersData || [])
    setStats(statsData)
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleLogout = async () => {
    await logoutAdmin()
    onLogout()
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId)
    const res = await updateOrderStatus(orderId, newStatus)
    if (res.success) {
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o))
    } else {
      alert('حدث خطأ أثناء تحديث الحالة')
    }
    setUpdatingId(null)
  }

  const filtered = orders.filter(o => {
    const matchSearch = !search || 
      o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      o.phone?.includes(search) ||
      o.orderNumber?.includes(search)
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-rose-600 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">👑</span>
            </div>
            <span className="font-black text-rose-900 text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
              Admin Dashboard
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:block">مرحباً، <strong>{username}</strong></span>
            <button
              onClick={() => fetchData()}
              className="text-sm px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium transition-colors"
            >
              🔄 تحديث
            </button>
            <a href="/studio" target="_blank"
              className="text-sm px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium transition-colors border border-purple-200">
              📦 Sanity Studio
            </a>
            <a href="/" className="text-sm px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium transition-colors">
              🏠 المتجر
            </a>
            <button onClick={handleLogout}
              className="text-sm px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-medium transition-colors">
              خروج
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <StatCard icon="📦" label="إجمالي الطلبات" value={stats.total} color="bg-blue-50" />
            <StatCard icon="⏳" label="قيد الانتظار" value={stats.pending} color="bg-yellow-50" />
            <StatCard icon="✅" label="تم التوصيل" value={stats.delivered} color="bg-green-50" />
            <StatCard icon="🌟" label="طلبات اليوم" value={stats.todayOrders} color="bg-purple-50" />
            <StatCard icon="💰" label="إجمالي الإيرادات" value={`${(stats.totalRevenue || 0).toLocaleString()} دج`} color="bg-rose-50" />
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="بحث باسم الزبون أو الهاتف..."
              className="w-full ps-9 pe-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
            />
            <span className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', ...Object.keys(STATUS)].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === s
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s === 'all' ? '📋 الكل' : (STATUS as any)[s]?.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin" />
              <p className="text-gray-400 text-sm">جاري تحميل الطلبات...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-gray-400 font-medium">لا توجد طلبات</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-right">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['رقم الطلب', 'الزبون', 'الولاية', 'الإجمالي', 'الحالة', 'التاريخ', 'إجراء'].map(h => (
                      <th key={h} className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((order) => (
                    <>
                      <tr
                        key={order._id}
                        className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                        onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}
                      >
                        <td className="px-5 py-4">
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded-lg text-gray-600">
                            #{(order.orderNumber || order._id.slice(-6)).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-900 text-sm">{order.customerName}</p>
                          <p className="text-xs text-gray-400 mt-0.5" dir="ltr">{order.phone}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm text-gray-600">{order.wilayaName || '—'}</span>
                          <p className="text-xs text-gray-400">{order.deliveryType === 'home' ? '🏠 منزلي' : '📍 مكتب'}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-bold text-rose-600 text-sm">{(order.totalAmount || 0).toLocaleString()} دج</span>
                        </td>
                        <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                          <select
                            value={order.status || 'pending'}
                            onChange={e => handleStatusChange(order._id, e.target.value)}
                            disabled={updatingId === order._id}
                            className={`text-xs font-bold px-3 py-1.5 rounded-full border cursor-pointer outline-none transition-all ${(STATUS as any)[order.status]?.color || 'bg-gray-100 text-gray-600 border-gray-200'}`}
                          >
                            {Object.entries(STATUS).map(([val, cfg]) => (
                              <option key={val} value={val} className="bg-white text-gray-800">{cfg.label}</option>
                            ))}
                          </select>
                          {updatingId === order._id && (
                            <span className="ms-2 text-xs text-gray-400">💾 جاري الحفظ...</span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-xs text-gray-400">
                          {new Date(order._createdAt).toLocaleDateString('ar-DZ', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                          <br/>
                          {new Date(order._createdAt).toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-5 py-4 text-xs text-rose-400">
                          {expandedId === order._id ? '▲ إخفاء' : '▼ التفاصيل'}
                        </td>
                      </tr>
                      {/* Expanded row */}
                      {expandedId === order._id && (
                        <tr key={`${order._id}-expanded`} className="bg-rose-50/30">
                          <td colSpan={7} className="px-5 py-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs font-bold text-gray-500 mb-2 uppercase">المنتجات المطلوبة</p>
                                {order.items?.map((item, i) => (
                                  <div key={i} className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                                    <span className="text-rose-400">◆</span>
                                    <span className="font-medium">{item.productName}</span>
                                    <span className="text-gray-400">×{item.quantity}</span>
                                    {item.size && <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{item.size}</span>}
                                    {item.color && <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{item.color}</span>}
                                  </div>
                                )) || <p className="text-gray-400 text-sm">لا توجد تفاصيل</p>}
                              </div>
                              <div>
                                <p className="text-xs font-bold text-gray-500 mb-2 uppercase">عنوان التوصيل</p>
                                <p className="text-sm text-gray-700">{order.address || '—'}</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <p className="text-center text-xs text-gray-300 mt-6">
          🔒 Admin Area — Queen of Lingerie © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}

// ─── Main Page ──────────────────────────────────────────────────────
export default function AdminPage() {
  const [authState, setAuthState] = useState<'loading' | 'login' | 'dashboard'>('loading')
  const [username, setUsername] = useState('')

  useEffect(() => {
    checkAuth().then(({ authenticated, username: u }) => {
      if (authenticated) {
        setUsername(u || 'Admin')
        setAuthState('dashboard')
      } else {
        setAuthState('login')
      }
    })
  }, [])

  if (authState === 'loading') {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (authState === 'login') {
    return <LoginPage onLogin={() => { setUsername('Admin'); setAuthState('dashboard') }} />
  }

  return <Dashboard username={username} onLogout={() => setAuthState('login')} />
}
