# 🌱 Fertilizer Distribution App

A modern full-stack web application designed to streamline and manage fertilizer distribution for farmers.

🔗 **Live Demo:** https://fertilizer-distribution.vercel.app/
📦 **GitHub Repo:** https://github.com/feyyu120/fertilizer-distribution.git

---

## 🚀 Overview

The Fertilizer Distribution App helps improve transparency, efficiency, and fair distribution of fertilizer to farmers. 
---

## ✨ Features
 * 🔐 Authentication & role-based access (Admin/User)
 * email notification service for successful order delievery and other notifications
 * 📊 Dashboard for monitoring distribution
 * 🌐 Fully responsive modern UI

 ### farmer features
  * 👨‍🌾 Farmer registration & login
  * 📧 Farmer email & password reset
  * farmer can see all the fertilizers and their prices
  * farmer can order fertilizer
  * farmer can post news to community

### admin features
  * 📦 Fertilizer management (add, update, delete)
  * 🧾 Order request management
  * 📡 Admin sees list of farmers and their orders 
  * admin can approve or reject orders
  * admin can update order status
  * admin can see list of fertilizers
  * admin can see list of news and he can post news
  * admin can delete news

---

## 🛠️ Tech Stack

### Frontend

* React / Vite
* Tailwind CSS

### Backend

* Node.js
* Express.js
* MongoDB

---

## 📁 Project Structure

```
fertilizer-distribution/
│
├── web/        # React frontend
├── backend/         # Express backend
│   └── src/
│       └── server.js
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/feyyu120/fertilizer-distribution.git
cd fertilizer-distribution
```

---

### 2️⃣ Backend setup

```bash
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
```

Run backend:

```bash
npm run dev
```

---

### 3️⃣ Frontend setup

```bash
cd web
npm install
npm run dev
```

---

## 🌍 Environment Variables

| Variable   | Description            |
| ---------- | ---------------------- |
| PORT       | Backend server port    |
| MONGO_URI  | MongoDB connection URI |
| JWT_SECRET | Authentication secret  |

---



## 🚀 Deployment

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/feyyu120/fertilizer-distribution.git
git push -u origin main
```

### Frontend (Vercel)

* Connect GitHub repo
* Set root directory → `web`
* Deploy

### Backend (Render)

* Root directory → `backend`
* Start command:

```bash
node src/server.js
```

---


## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create your branch (`git checkout -b feature/new-feature`)
3. Commit changes
4. Push to GitHub
5. Open a Pull Request

---



## 💡 Future Improvements

* 📱 Mobile app support
* 🌍 Multi-language support
* 📈 Advanced analytics dashboard
* 🤖 AI-based fertilizer recommendations
* chapa payment integration

---

## 👨‍💻 Author

**Feysel**
GitHub: https://github.com/feyyu120

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
