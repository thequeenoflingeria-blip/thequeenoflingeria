'use server'

import { cookies } from 'next/headers'
import { sanityClient } from '@/lib/sanity'
import { revalidatePath } from 'next/cache'
import { createHmac } from 'crypto'

// ─── Rate Limiting (in-memory, per process) ───────────────────────
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>()
const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes

// ─── Session Token ─────────────────────────────────────────────────
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'fallback-secret-change-me'
const SESSION_DURATION = 8 * 60 * 60 * 1000 // 8 hours

function generateSessionToken(username: string): string {
  const expires = Date.now() + SESSION_DURATION
  const payload = `${username}:${expires}`
  const signature = createHmac('sha256', SESSION_SECRET).update(payload).digest('hex')
  return Buffer.from(`${payload}:${signature}`).toString('base64')
}

function verifySessionToken(token: string): { valid: boolean; username?: string } {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const parts = decoded.split(':')
    if (parts.length !== 3) return { valid: false }

    const [username, expiresStr, signature] = parts
    const expires = parseInt(expiresStr)

    if (Date.now() > expires) return { valid: false } // expired

    const payload = `${username}:${expires}`
    const expectedSig = createHmac('sha256', SESSION_SECRET).update(payload).digest('hex')

    if (signature !== expectedSig) return { valid: false } // tampered
    return { valid: true, username }
  } catch {
    return { valid: false }
  }
}

function getRateLimitKey(identifier: string): string {
  return identifier.slice(0, 40)
}

// ─── Login ─────────────────────────────────────────────────────────
export async function loginAdmin(username: string, password: string, identifier = 'default') {
  const key = getRateLimitKey(identifier)
  const now = Date.now()
  const attempt = loginAttempts.get(key)

  // Check lockout
  if (attempt) {
    if (attempt.count >= MAX_ATTEMPTS && now - attempt.firstAttempt < LOCKOUT_DURATION) {
      const minutesLeft = Math.ceil((LOCKOUT_DURATION - (now - attempt.firstAttempt)) / 60000)
      return { success: false, error: `تم قفل الحساب مؤقتاً. حاول بعد ${minutesLeft} دقيقة.`, locked: true }
    }
    // Reset if lockout expired
    if (now - attempt.firstAttempt >= LOCKOUT_DURATION) {
      loginAttempts.delete(key)
    }
  }

  const adminUsername = process.env.ADMIN_USERNAME || 'admin'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin'

  const usernameMatch = username === adminUsername
  const passwordMatch = password === adminPassword

  if (usernameMatch && passwordMatch) {
    // Clear rate limit on success
    loginAttempts.delete(key)

    // Generate secure session token
    const token = generateSessionToken(username)
    const cookieStore = await cookies()
    cookieStore.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/admin',
      maxAge: 8 * 60 * 60, // 8 hours
    })
    return { success: true }
  }

  // Record failed attempt
  const current = loginAttempts.get(key)
  if (!current) {
    loginAttempts.set(key, { count: 1, firstAttempt: now })
  } else {
    loginAttempts.set(key, { ...current, count: current.count + 1 })
  }

  const remaining = MAX_ATTEMPTS - (loginAttempts.get(key)?.count || 0)
  if (remaining <= 0) {
    return { success: false, error: 'تم قفل الحساب لمدة 15 دقيقة بسبب محاولات تسجيل دخول متكررة.', locked: true }
  }

  return { success: false, error: `اسم المستخدم أو كلمة المرور غير صحيحة. (${remaining} محاولات متبقية)` }
}

// ─── Logout ────────────────────────────────────────────────────────
export async function logoutAdmin() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
  revalidatePath('/admin')
}

// ─── Auth Check ────────────────────────────────────────────────────
export async function checkAuth(): Promise<{ authenticated: boolean; username?: string }> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_session')?.value
  if (!token) return { authenticated: false }

  const result = verifySessionToken(token)
  return { authenticated: result.valid, username: result.username }
}

// ─── Orders ────────────────────────────────────────────────────────
export async function getOrders() {
  const query = `*[_type == "order"] | order(_createdAt desc) {
    _id,
    _createdAt,
    orderNumber,
    customerName,
    phone,
    address,
    deliveryType,
    totalAmount,
    status,
    "wilayaName": wilaya->wilaya,
    items[]{
      quantity,
      size,
      color,
      priceAtPurchase,
      "productName": product->name,
      "productNameAr": product->name
    }
  }`
  try {
    return await sanityClient.fetch(query)
  } catch {
    return []
  }
}

// ─── Update Order Status ───────────────────────────────────────────
export async function updateOrderStatus(orderId: string, newStatus: string) {
  const VALID_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
  if (!VALID_STATUSES.includes(newStatus)) {
    return { success: false, error: 'حالة غير صالحة' }
  }

  // Re-verify auth
  const auth = await checkAuth()
  if (!auth.authenticated) {
    return { success: false, error: 'غير مصرح' }
  }

  try {
    await sanityClient.patch(orderId).set({ status: newStatus }).commit()
    revalidatePath('/admin')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

// ─── Dashboard Stats ───────────────────────────────────────────────
export async function getDashboardStats() {
  try {
    const stats = await sanityClient.fetch(`{
      "total": count(*[_type == "order"]),
      "pending": count(*[_type == "order" && status == "pending"]),
      "delivered": count(*[_type == "order" && status == "delivered"]),
      "todayOrders": count(*[_type == "order" && _createdAt > now() - 60*60*24]),
      "totalRevenue": math::sum(*[_type == "order" && status != "cancelled"].totalAmount)
    }`)
    return stats
  } catch {
    return { total: 0, pending: 0, delivered: 0, todayOrders: 0, totalRevenue: 0 }
  }
}
