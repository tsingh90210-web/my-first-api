![Simple CI Check](https://github.com/tsingh90210-web/my-first-api/actions/workflows/node.js.yml/badge.svg)

# 🚀 PayPal Payment Processing API

> Secure serverless payment integration — built with Node.js, Google Cloud Run & PayPal REST API

---

## ✅ What This Project Does

- ✅ Create and verify payments via PayPal REST API
- ✅ Store transaction records securely in Supabase (PostgreSQL)
- ✅ Separate Sandbox and Live environments safely
- ✅ Automated CI/CD — every commit gets checked automatically
- ✅ Infrastructure defined as code with Terraform
- ✅ Auto-scaling — zero manual intervention

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js 20 / Express.js |
| Payments | PayPal REST API (Sandbox & Live modes) |
| Database | Supabase / PostgreSQL |
| Hosting | Google Cloud Run — serverless, auto-scaling |
| CI/CD | GitHub Actions — automated checks on every commit |
| Infrastructure | Terraform — Infrastructure as Code |

---

## 🔄 CI/CD Pipeline

Every push to **main** triggers an automatic check via GitHub Actions ✅

- ✅ **Trigger:** Runs automatically on every code push
- ✅ **Checkout & Setup:** Pulls code + sets up Node.js environment
- ✅ **Install & Verify:** Dependencies installed, code validated
- ⏭ **Next:** Will extend to auto-deploy to Cloud Run once fully tested

> *Broken code never reaches production. Issues caught early, every single time.*

---

## 📦 Infrastructure as Code (Terraform)

This project uses **Terraform** to define and provision the Cloud Run infrastructure as code — ensuring consistency, repeatability, and version-controlled deployments.

### 📁 Project Structure

| File | Purpose |
|------|---------|
| `terraform/main.tf` | GCP provider & Cloud Run service definition |
| `terraform/variables.tf` | Project configuration settings |
| `terraform/outputs.tf` | Deployment outputs (e.g., service URL) |

### 🧰 What Each File Does

- **`main.tf`** — Configures the Google Cloud Provider and declares the Cloud Run service resource, including container port and traffic routing settings
- **`variables.tf`** — Stores environment-specific values (GCP project ID, region) separately for security and reusability
- **`outputs.tf`** — Automatically returns the deployed Cloud Run service URL after provisioning

### 💡 Key Concepts Demonstrated

- ✅ **Infrastructure as Code** — everything defined in version-controlled files
- ✅ **Separation of concerns** — configuration vs. resources vs. outputs
- ✅ **Reusable** — spin up an identical environment with `terraform apply`
- ✅ **Consistent** — no manual console clicks = reproducible deployments

---

## 🌐 Live Demo

| Item | Details |
|------|---------|
| **API URL** | https://my-first-api-801597296257.europe-west2.run.app/pay |
| **Status** | ✅ Live & Running |

---

## 💻 Run Locally

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Add your credentials to the .env file

# Start dev server
npm run dev
# Server: http://localhost:8080

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


