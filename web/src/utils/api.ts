const API = 'http://localhost:5000/api';

export const api = {
  // Dashboard
  getStats: () => fetch(`${API}/admin/dashboard`).then(r => r.json()),

  // Farmers - all
  getAllFarmers: (status?: string) =>
    fetch(`${API}/admin/farmers${status ? `?status=${status}` : ''}`).then(r => r.json()),
  // Farmers - pending only (used by overview)
  getPendingFarmers: () => fetch(`${API}/admin/pending-farmers`).then(r => r.json()),
  // Update farmer status
  updateFarmerStatus: (id: string, status: string) =>
    fetch(`${API}/admin/farmers/${id}/status`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status })
    }).then(r => r.json()),
  // Legacy approve (still used by overview inline buttons)
  approveFarmer: (id: string, status: string) =>
    fetch(`${API}/admin/approve-farmer/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status })
    }).then(r => r.json()),
  // Delete farmer
  deleteFarmer: (id: string) =>
    fetch(`${API}/admin/farmers/${id}`, { method: 'DELETE' }).then(r => r.json()),

  // Fertilizers
  getFertilizers: () => fetch(`${API}/fertilizers`).then(r => r.json()),
  addFertilizer: (data: any) =>
    fetch(`${API}/fertilizers`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
  updateFertilizer: (id: string, data: any) =>
    fetch(`${API}/fertilizers/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
  deleteFertilizer: (id: string) =>
    fetch(`${API}/fertilizers/${id}`, { method: 'DELETE' }).then(r => r.json()),

  // Orders
  getOrders: () => fetch(`${API}/orders`).then(r => r.json()),
  updateOrderStatus: (id: string, status: string) =>
    fetch(`${API}/orders/${id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) }).then(r => r.json()),

  // News
  getNews: () => fetch(`${API}/news`).then(r => r.json()),
  addNews: (data: any) =>
    fetch(`${API}/news`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
  updateNews: (id: string, data: any) =>
    fetch(`${API}/news/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
  deleteNews: (id: string) =>
    fetch(`${API}/news/${id}`, { method: 'DELETE' }).then(r => r.json()),
  toggleNewsLike: (id: string, userId: string) =>
    fetch(`${API}/news/${id}/like`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId }) }).then(r => r.json()),

  // Messages
  getMessages: () => fetch(`${API}/messages`).then(r => r.json()),
  sendMessage: (data: any) =>
    fetch(`${API}/messages`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
  replyMessage: (id: string, reply: string) =>
    fetch(`${API}/messages/${id}/reply`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reply }) }).then(r => r.json()),
  deleteMessage: (id: string) =>
    fetch(`${API}/messages/${id}`, { method: 'DELETE' }).then(r => r.json()),
  // Profile
  updateProfile: (id: string, fullname: string) =>
    fetch(`${API}/auth/profile`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, fullname }) }).then(r => r.json()),
  deleteProfile: (id: string) =>
    fetch(`${API}/auth/profile`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }).then(r => r.json()),
  getMyOrders: (id: string) =>
    fetch(`${API}/auth/my-orders?id=${id}`).then(r => r.json()),
  getMyMessages: (phone: string) =>
    fetch(`${API}/auth/my-messages?phone=${phone}`).then(r => r.json()),
};
