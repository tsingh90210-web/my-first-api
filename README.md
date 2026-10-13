![Simple CI Check](https://github.com/tsingh90210-web/my-first-api/actions/workflows/node.js.yml/badge.svg)

Node.js & Google Cloud Run PayPal Payment Processing API
🚀 Payment Processing API — Node.js & Google Cloud Run
Secure serverless payment integration • PayPal • GCP Cloud Run • CI/CD • Terraform

📌 What This Project Does
•	✅ Create and verify payments via PayPal REST API
•	✅ Store transaction records securely in Supabase (PostgreSQL)
•	✅ Separate Sandbox and Live environments safely
•	✅ Auto-deploy to production — zero manual steps

🛠️ Tech Stack
•	Runtime: Node.js 20 / Express.js
•	Payments: PayPal REST API (Sandbox & Live modes)
•	Database: Supabase / PostgreSQL
•	Hosting: Google Cloud Run — serverless, auto-scaling
•	CI/CD: GitHub Actions — lint → test → security scan → deploy automatically
•	Infrastructure: Terraform — Infrastructure as Code

🤖 CI/CD Pipeline
Every push to main runs this — only deploys if ALL checks pass ✅
Stage	Purpose	Status
📏 Lint	Enforce consistent code style	✅ Active
🧪 Test	Unit & integration tests	✅ Active
🔒 Security	npm audit + CodeQL vulnerability scan	✅ Active
🚀 Deploy	Build & deploy to Cloud Run	✅ Automated

Broken code never reaches production. Issues caught early, every single time.

🌐 Live Demo
•	API URL: https://my-first-api-881597296257.europe-west2.run.app
•	Status: ✅ Live & Running

💻 Run Locally
bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Add your credentials to .env file

# Start dev server
npm run dev
Server: http://localhost:8080

📁 Folder Structure
Plain Text
├── .github/workflows/   # CI/CD pipeline
├── src/                  # API source code
├── terraform/            # Infrastructure as Code
├── .env.example          # Env vars template
├── Dockerfile
├── package.json
└── README.md

✨ Key Features
•	🔐 Secure — credentials via environment variables only
•	🔄 Dual environments — Sandbox and Live configurations
•	🚀 Serverless — scales automatically, pay-per-use
•	🛡️ Automated safety — checks run on every commit
•	📊 Cost control — GCP budget alerts configured

📝 What I Learned
•	Building secure third-party API integrations
•	Infrastructure as Code with Terraform
•	Setting up CI/CD pipelines from scratch
•	Serverless deployment on Google Cloud Run
•	Managing environment configurations safely
