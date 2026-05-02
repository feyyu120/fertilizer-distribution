const API = import.meta.env.VITE_API_URL || 'https://fertilizer-distribution.onrender.com/api';
export const apiUrl = (path: string) => `${API}${path}`;


export const api = {
  // ==================== AUTH ====================
  register: (data: any) =>
    fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  login: (data: any) =>
    fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  getMe: (token: string) =>
    fetch(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()),

  // ==================== ADMIN ====================
  getStats: () =>
    fetch(`${API}/admin/dashboard`).then(r => r.json()),
  getDashboardStats: () =>
    fetch(`${API}/admin/dashboard`).then(r => r.json()),

  getPendingFarmers: () =>
    fetch(`${API}/admin/pending-farmers`).then(r => r.json()),

  getAllFarmers: (status?: string) =>
    fetch(`${API}/admin/farmers${status ? `?status=${status}` : ''}`).then(r => r.json()),

  approveFarmer: (id: string, status: string) =>
    fetch(`${API}/admin/approve-farmer/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).then(r => r.json()),

  updateFarmerStatus: (id: string, status: string) =>
    fetch(`${API}/admin/farmers/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).then(r => r.json()),

  deleteFarmer: (id: string) =>
    fetch(`${API}/admin/farmers/${id}`, { method: 'DELETE' }).then(r => r.json()),

  // ==================== FERTILIZERS ====================
  getFertilizers: () =>
    fetch(`${API}/fertilizers`).then(r => r.json()),

  addFertilizer: (data: any) =>
    fetch(`${API}/fertilizers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  updateFertilizer: (id: string, data: any) =>
    fetch(`${API}/fertilizers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  deleteFertilizer: (id: string) =>
    fetch(`${API}/fertilizers/${id}`, { method: 'DELETE' }).then(r => r.json()),

  // ==================== ORDERS ====================
  getOrders: () =>
    fetch(`${API}/orders`).then(r => r.json()),

  createOrder: (data: any) =>
    fetch(`${API}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  updateOrderStatus: (id: string, status: string) =>
    fetch(`${API}/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).then(r => r.json()),

  // ==================== NEWS ====================
  getNews: () =>
    fetch(`${API}/news`).then(r => r.json()),

  getMyPosts: (userId: string) =>
    fetch(`${API}/news/my-posts?userId=${userId}`).then(r => r.json()),

  addNews: (data: any) =>
    fetch(`${API}/news`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  updateNews: (id: string, data: any) =>
    fetch(`${API}/news/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  deleteNews: (id: string) =>
    fetch(`${API}/news/${id}`, { method: 'DELETE' }).then(r => r.json()),

  // Like — sends userId in the body (required by backend)
  toggleNewsLike: (postId: string, userId: string) =>
    fetch(`${API}/news/${postId}/like`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    }).then(r => r.json()),

  // Add comment
  addNewsComment: (postId: string, commentData: any) =>
    fetch(`${API}/news/${postId}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commentData)
    }).then(r => r.json()),

  // ==================== MESSAGES ====================
  getMessages: () =>
    fetch(`${API}/messages`).then(r => r.json()),

  sendMessage: (data: any) =>
    fetch(`${API}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  replyMessage: (id: string, reply: string) =>
    fetch(`${API}/messages/${id}/reply`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply })
    }).then(r => r.json()),

  deleteMessage: (id: string) =>
    fetch(`${API}/messages/${id}`, { method: 'DELETE' }).then(r => r.json()),

  // ==================== USER SPECIFIC ====================
  getMyOrders: (userId: string) =>
    fetch(`${API}/orders/my-orders?userId=${userId}`).then(r => r.json()),

  getMyMessages: (phone: string) =>
    fetch(`${API}/messages/my-messages?phone=${phone}`).then(r => r.json()),

  // Profile
  updateProfile: (id: string, data: any) =>
    fetch(`${API}/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...data })
    }).then(r => r.json()),

  markFertilizersRead: (id: string) =>
    fetch(`${API}/auth/read-fertilizers`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    }).then(r => r.json()),

  deleteProfile: (id: string) =>
    fetch(`${API}/auth/profile`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    }).then(r => r.json()),

  // ==================== ABOUT ====================
  getAbout: () =>
    fetch(`${API}/about`).then(r => r.json()),

  updateAbout: (data: { content: string }) =>
    fetch(`${API}/about`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),
};

export default api;
