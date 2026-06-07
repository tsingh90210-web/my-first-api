// --------------------------
// Required Packages
// --------------------------
const express = require('express');
const paypal = require('@paypal/checkout-server-sdk');
const path = require('path');
const fs = require('fs-extra');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const app = express();

// --------------------------
// PayPal Configuration
// --------------------------
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PORT = process.env.PORT || 3000;

// --------------------------
// PayPal Environment Setup
// --------------------------
function paypalEnvironment() {
return new paypal.core.SandboxEnvironment(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET);
}
function paypalClient() {
return new paypal.core.PayPalHttpClient(paypalEnvironment());
}

// --------------------------
// 💾 Persistent Payment Storage (JSON File)
// --------------------------
const PAYMENTS_FILE = path.join(__dirname, 'payments.json');
let paymentRecords = [];

// Load saved payments when server starts
async function loadPayments() {
try {
const exists = await fs.pathExists(PAYMENTS_FILE);
if (exists) {
paymentRecords = await fs.readJson(PAYMENTS_FILE);
} else {
paymentRecords = [];
await fs.writeJson(PAYMENTS_FILE, []);
}
} catch (err) {
console.error('Error loading payments:', err);
paymentRecords = [];
}
}
loadPayments();

// Save payments to file permanently
async function savePayments() {
try {
await fs.writeJson(PAYMENTS_FILE, paymentRecords, { spaces: 2 });
} catch (err) {
console.error('Error saving payments:', err);
}
}

// --------------------------
// 🔐 Optional Authentication Setup
// --------------------------
const ENABLE_AUTH = process.env.ENABLE_AUTH === 'true';
const JWT_SECRET = process.env.JWT_SECRET || 'your_secure_random_secret_key';

// Default test user - you can change username/password
const users = [
{
id: 1,
username: 'admin',
passwordHash: bcrypt.hashSync('admin123', 10)
}
];

// Authentication middleware
const authenticate = (req, res, next) => {
if (!ENABLE_AUTH) return next(); // Skip if auth is disabled

const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
if (!token) return res.redirect('/login');

try {
const decoded = jwt.verify(token, JWT_SECRET);
req.user = users.find(u => u.id === decoded.userId);
req.user ? next() : res.redirect('/login');
} catch {
return res.redirect('/login');
}
};

// --------------------------
// Global Middleware
// --------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// --------------------------
// Auth Routes (only active if enabled)
// --------------------------
if (ENABLE_AUTH) {
app.get('/login', (req, res) => {
res.send(`
<!DOCTYPE html>
<html><head><title>Login</title>
<style>
body { font-family: Arial; max-width: 400px; margin: 50px auto; padding: 20px; }
.form-group { margin-bottom: 15px; }
label { display: block; margin-bottom: 5px; }
input { width: 100%; padding: 10px; font-size: 16px; border: 1px solid #ddd; border-radius: 4px; }
button { width: 100%; padding: 12px; background: #0070ba; color: white; border: none; border-radius: 4px; font-size: 18px; cursor: pointer; margin-top: 10px; }
button:hover { background: #005ea6; }
</style></head>
<body>
<h2 style="text-align:center; color:#2c3e50;">Login</h2>
<form method="POST" action="/login">
<div class="form-group">
<label>Username:</label>
<input type="text" name="username" required>
</div>
<div class="form-group">
<label>Password:</label>
<input type="password" name="password" required>
</div>
<button type="submit">Login</button>
</form>
</body></html>
`);
});

app.post('/login', async (req, res) => {
const { username, password } = req.body;
const user = users.find(u => u.username === username);

if (!user || !await bcrypt.compare(password, user.passwordHash)) {
return res.send('<p style="text-align:center; color:red;">Invalid credentials. <a href="/login">Try again</a></p>');
}

const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
res.cookie('token', token, { httpOnly: true, maxAge: 86400000 });
res.redirect('/');
});

app.get('/logout', (req, res) => {
res.clearCookie('token');
res.redirect('/login');
});
}

// --------------------------
// Protect Main Routes
// --------------------------
app.use('/', authenticate);
app.use('/dashboard', authenticate);
app.use('/paypal/create', authenticate);

// --------------------------
// 1. Create PayPal Payment
// --------------------------
app.post('/paypal/create', async (req, res) => {
try {
const { userName, amount } = req.body;
const enteredName = userName.trim();

if (!enteredName || !amount || isNaN(amount) || Number(amount) <= 0) {
return res.json({ success: false, message: 'Please enter a valid name and amount greater than £0.00' });
}

const request = new paypal.orders.OrdersCreateRequest();
request.prefer("return=representation");
request.requestBody({
intent: 'CAPTURE',
purchase_units: [{
amount: {
currency_code: 'GBP',
value: Number(amount).toFixed(2)
},
description: `Payment from ${enteredName}`
}],
application_context: {
return_url: `http://localhost:${PORT}/payment/success?enteredName=${encodeURIComponent(enteredName)}`,
cancel_url: `http://localhost:${PORT}/payment/cancel`
}
});

const order = await paypalClient().execute(request);
const approvalLink = order.result.links.find(link => link.rel === 'approve');

if (!approvalLink) throw new Error('Could not generate PayPal payment link');

res.json({ success: true, approvalUrl: approvalLink.href });

} catch (err) {
console.error('Create error:', err);
res.json({ success: false, message: err.message });
}
});

// --------------------------
// 2. Payment Success
// --------------------------
app.get('/payment/success', async (req, res) => {
try {
const orderId = req.query.token;
const enteredName = decodeURIComponent(req.query.enteredName || 'Unknown User');

if (!orderId) throw new Error('No order ID found');

const captureRequest = new paypal.orders.OrdersCaptureRequest(orderId);
const capture = await paypalClient().execute(captureRequest);
const details = capture.result;

const amount = details?.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value
|| details?.purchase_units?.[0]?.amount?.value
|| '0.00';

const paymentData = {
orderId: details.id,
payerName: enteredName,
amount: amount,
currency: details?.purchase_units?.[0]?.amount?.currency_code ?? 'GBP',
status: details.status || 'COMPLETED',
time: new Date().toLocaleString()
};

paymentRecords.push(paymentData);
await savePayments(); // ✅ Saves permanently to JSON file

res.send(`
<!DOCTYPE html>
<html>
<head>
<title>Payment Successful</title>
<style>
body { font-family: Arial; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
.card { border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); background: #f8fff9; border:1px solid #d4edda; }
h2 { color: #155724; }
p { font-size: 18px; margin: 10px 0; }
a { display: inline-block; margin: 20px 10px 0; padding: 12px 24px; background: #0070ba; color: white; text-decoration: none; border-radius: 4px; }
a:hover { background: #005ea6; }
</style>
</head>
<body>
<div class="card">
<h2>✅ Payment Completed Successfully!</h2>
<p><strong>Order ID:</strong> ${paymentData.orderId}</p>
<p><strong>Payer Name:</strong> ${paymentData.payerName}</p>
<p><strong>Amount:</strong> £${paymentData.amount}</p>
<p><strong>Status:</strong> ${paymentData.status}</p>
<p><strong>Date/Time:</strong> ${paymentData.time}</p>
<br>
<a href="/dashboard">📋 View Dashboard</a>
<a href="/">➕ New Payment</a>
${ENABLE_AUTH ? '<br><br><a href="/logout" style="background:#dc3545;">Logout</a>' : ''}
</div>
</body>
</html>
`);

} catch (err) {
console.error('Capture error:', err);
res.send(`
<div style="max-width:600px; margin:50px auto; text-align:center; background:#f8d7da; color:#721c24; padding:30px; border-radius:8px;">
<h2>❌ Payment Failed</h2>
<p>${err.message}</p>
<a href="/" style="display:inline-block; margin-top:20px; padding:12px 24px; background:#0070ba; color:white; text-decoration:none; border-radius:4px;">Try Again</a>
</div>
`);
}
});

// --------------------------
// 3. Payment Cancelled
// --------------------------
app.get('/payment/cancel', (req, res) => {
res.send(`
<div style="max-width:600px; margin:50px auto; text-align:center; background:#fff3cd; color:#856404; padding:30px; border-radius:8px;">
<h2>⚠️ Payment Cancelled</h2>
<p>You have cancelled the payment process.</p>
<a href="/" style="display:inline-block; margin-top:20px; padding:12px 24px; background:#0070ba; color:white; text-decoration:none; border-radius:4px;">Return</a>
</div>
`);
});

// --------------------------
// 4. Payment Dashboard
// --------------------------
app.get('/dashboard', (req, res) => {
const rows = paymentRecords.map(p => `
<tr>
<td>${p.orderId}</td>
<td>${p.payerName}</td>
<td>£${p.amount}</td>
<td>${p.status}</td>
<td>${p.time}</td>
</tr>
`).join('');

res.send(`
<!DOCTYPE html>
<html>
<head>
<title>Payment Dashboard</title>
<style>
body { font-family: Arial; max-width: 950px; margin: 30px auto; padding: 20px; }
h2 { text-align: center; color: #2c3e50; margin-bottom: 30px; }
a { display: inline-block; margin-bottom: 25px; padding: 10px 20px; background: #0070ba; color: white; text-decoration: none; border-radius: 4px; margin-right:10px; }
a:hover { background: #005ea6; }
a.logout { background:#dc3545; }
table { width: 100%; border-collapse: collapse; box-shadow: 0 2px 10px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden; }
th, td { padding: 15px; text-align: left; border-bottom: 1px solid #eee; }
th { background-color: #0070ba; color: white; font-weight: 600; }
tr:nth-child(even) { background-color: #f9f9f9; }
</style>
</head>
<body>
<h2>📋 Payment Dashboard</h2>
<a href="/">➕ Make New Payment</a>
${ENABLE_AUTH ? '<a href="/logout" class="logout">Logout</a>' : ''}
${paymentRecords.length === 0
? '<p style="text-align:center; color:#666; font-size:18px;">No payments yet.</p>'
: `<table>
<thead><tr><th>Order ID</th><th>Name</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
<tbody>${rows}</tbody>
</table>`
}
</body>
</html>
`);
});

// --------------------------
// 5. Home / Payment Form
// --------------------------
app.get('/', (req, res) => {
res.send(`
<!DOCTYPE html>
<html>
<head>
<title>PayPal Payment</title>
<style>
body { font-family: Arial; max-width: 500px; margin: 50px auto; padding: 20px; }
h2 { text-align:center; color:#2c3e50; margin-bottom:30px; }
.form-group { margin-bottom:20px; }
label { display:block; margin-bottom:8px; font-weight:bold; }
input { width:100%; padding:12px; font-size:16px; border:1px solid #ddd; border-radius:4px; }
button { width:100%; padding:14px; background:#0070ba; color:white; border:none; border-radius:4px; font-size:18px; cursor:pointer; margin-top:10px; }
button:hover { background:#005ea6; }
.logout { text-align:right; margin-bottom:20px; }
.logout a { color:#dc3545; text-decoration:none; }
</style>
</head>
<body>
${ENABLE_AUTH ? '<div class="logout"><a href="/logout">Logout</a></div>' : ''}
<h2>Make a Payment</h2>
<div class="form-group">
<label>Your Name:</label>
<input type="text" id="userName" placeholder="e.g. John Smith" required>
</div>
<div class="form-group">
<label>Amount (£):</label>
<input type="number" id="amount" step="0.01" min="0.01" placeholder="e.g. 5.00" required>
</div>
<button onclick="createPayment()">Proceed to PayPal</button>

<script>
async function createPayment() {
const userName = document.getElementById('userName').value.trim();
const amount = document.getElementById('amount').value;

if (!userName || !amount || Number(amount) <= 0) {
alert('Please enter a valid name and amount over £0.00');
return;
}

try {
const res = await fetch('/paypal/create', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ userName, amount })
});
const data = await res.json();
if (data.success) {
window.location.href = data.approvalUrl;
} else {
alert('Error: ' + data.message);
}
} catch (err) {
alert('Connection error, please try again.');
}
}
</script>
</body>
</html>
`);
});

// --------------------------
// Start Server
// --------------------------
app.listen(PORT, () => {
console.log(`✅ Server running on http://localhost:${PORT}`);
console.log(`💾 Storage: JSON file (permanent)`);
console.log(`🔐 Authentication: ${ENABLE_AUTH ? 'ENABLED' : 'DISABLED'}`);
});