# PayPal Payment System

A secure, end‑to‑end payment processing application built with Node.js and Express, integrated with the PayPal Checkout API (Sandbox). Designed with security, maintainability, and portability in mind.

---

## ✨ Key Features
- Complete PayPal payment flow (create → approve → capture)
- Custom payer name and amount input
- Success and cancellation handling
- **Persistent storage**: All transactions saved permanently in a JSON file
- **Transaction dashboard**: View full payment history with order details
- **Optional user authentication**: JWT‑based login to restrict access
- Secure credential management via environment variables
- Fully containerised with Docker for consistent deployment
- Clean, responsive web interface
- No hard‑coded secrets — follows industry security best practices

---

## 🛠️ Tech Stack
- **Backend**: Node.js + Express.js
- **Payment Gateway**: PayPal Checkout API (Sandbox environment)
- **Storage**: JSON file (can be easily upgraded to MongoDB/PostgreSQL)
- **Security**: Environment variables, optional JWT authentication, password hashing
- **Containerisation**: Docker & Docker Compose
- **Tools**: Git, npm, dotenv

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js v18+ (or Docker/Rancher Desktop)
- A PayPal Developer account with Sandbox API credentials

---

### Option A: Run locally with Node.js
1. **Clone the repository**
```bash
git clone https://github.com/tsingh90210-web/my-first-api.git
cd my-first-api