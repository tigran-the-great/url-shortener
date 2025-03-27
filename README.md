# 🔗 URL Shortener App

A fullstack URL shortener application built with:

- **Frontend**: React + TypeScript + TailwindCSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: SQLite (via better-sqlite3)

Create short links, track visits, and view analytics via a clean UI.

---

## 🚀 Features

- Shorten long URLs like `facebook.com` → `http://localhost:5001/abc123`
- Track visits and view URL stats
- Dashboard for viewing already visited URLs
- Copy shortened links to clipboard
- Stylish UI with TailwindCSS
- SQLite for lightweight and fast development

---

## 🧩 Folder Structure

```
url-shortener/
├── backend/      # Node.js + Express API
├── frontend/     # React + Tailwind app
```

---

## ⚙️ Prerequisites

- Node.js (v18 or later recommended)
- npm
- [Optional] Docker (for containerization)

---

## 🛠 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/url-shortener.git
cd url-shortener
```

---

### 2. Backend Setup

```bash
cd backend
npm install
npm run dev
```

This will start the backend server at [http://localhost:5001](http://localhost:5001)

> It uses SQLite by default and creates `data.db` automatically.

---

### 3. Frontend Setup

In a separate terminal:

```bash
cd frontend
npm install
npm start
```

This will start the React app at [http://localhost:3000](http://localhost:3000)

> The frontend proxies API requests to the backend (`http://localhost:5001`) via `proxy` config in `package.json`.

---

## 📦 Environment Variables

No `.env` setup needed unless you change ports or use a different DB.

### Optional `.env` for backend (`backend/.env`):

```env
PORT=5001
```

---

## 🧪 Running Tests

To run backend unit tests:

```bash
cd backend
npm test
```

Tests include:

- URL creation
- Redirection logic
- URL listing
- Error handling

---

## 🐳 Docker

For Running both backend and frontend run

```
docker compose up
```

## 👨‍💻 Author

Built with ❤️ by [Tigran](https://github.com/tigran-the-great)
