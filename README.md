Payment Processing System 

 

* A production‑ready end‑to‑end payment application built with modern backend technologies, fully deployed and tested on Google Cloud Run with Terraform. 

 

🚀 Live Deployment 

* All services are fully operational and accessible online: 
* Payment Form: https://my-first-api-801597296257.europe-west2.run.app/pay 
* Payment History Dashboard: https://my-first-api-801597296257.europe-west2.run.app/pay/dashboard 
* Interactive API Documentation: https://my-first-api-801597296257.europe-west2.run.app/api/docs 

✅ Infrastructure Verified 

* Terraform confirms your local configuration matches the live production environment exactly:

'''bash
No changes. Your infrastructure still matches the configuration.
Terraform has checked that the real remote objects still match the result of your most recent changes, and found no differences. Apply complete! Resources: 0 added, 0 added, 0 changed, 0 destroyed.


📌 Project Overview 

This project delivers a complete, secure payment processing solution with full PayPal integration, designed for reliability, maintainability, and real‑world use. It follows industry best practices for API development, environment management, and cloud deployment — transforming a basic implementation into a fully functional production‑grade application with persistent data storage. 

🛠️ Technology Stack 

* Backend Framework: NestJS (TypeScript) — scalable, modular, type‑safe architecture 
* ORM: Prisma — type‑safe database interactions and schema migrations 
* Payment Gateway: PayPal REST API (Sandbox environment) — secure end‑to‑end transaction flows 
* Database: Supabase (PostgreSQL) — persistent, cloud‑hosted relational data storage 
* Cloud Hosting: Google Cloud Run — fully managed serverless deployment with automatic scaling 
* Infrastructure as Code: Terraform — repeatable, version‑controlled cloud resource setup 
* API Documentation: Swagger / OpenAPI — fully interactive, testable API documentation 
* DevOps & Tools: Git, npm, Docker, dotenv — version control, dependency management, and secure environment handling 

✅ Core Features 

* Complete PayPal Payment Flow: End‑to‑end order creation, user approval, and payment capture 
* Smart Redirect Handling: Dedicated success and cancellation pages, with no broken links or local environment errors 
* Persistent Data Storage: All transactions saved permanently to a PostgreSQL database, with full history and status tracking 
* Payment Dashboard: Clear, real‑time view of all completed payments with timestamps and details 
* Secure Configuration: All credentials and secrets managed via environment variables — no sensitive data committed to version control 
* Environment Separation: Clear distinction between local development and live production environments 
* Responsive UI: Clean, accessible payment form and dashboard 
* Full Test Coverage: All flows tested end‑to‑end, with consistent behaviour across environments 

🧩 Deployment & Infrastructure 

This project uses Terraform to define and provision all cloud resources consistently: 

* Automatically configures Google Cloud Run service with correct region (europe‑west2) 
* Manages public access permissions and IAM roles securely 
* Deploys environment variables without hardcoding secrets 
* Ensures identical infrastructure every deployment — no manual console setup required 

Production Deployment 

bash 

Run 

# 1. Initialize Terraform 

cd terraform 

terraform init 

 

# 2. Preview infrastructure changes 

terraform plan 

 

# 3. Deploy to Google Cloud 

terraform apply 

Local Setup (For Development) 

bash 

Run 

# 1. Clone the repository 

git clone https://github.com/tsingh90210/web-my-first-api.git 

cd my-first-api 

 

# 2. Install dependencies 

npm install 

 

# 3. Configure environment variables 

# Copy .env.example to .env and populate your values: 

# - DATABASE_URL (Supabase connection string) 

# - PAYPAL_CLIENT_ID 

# - PAYPAL_CLIENT_SECRET 

 

# 4. Initialise database schema 

npx prisma db push 

 

# 5. Start development server 

npm run start:dev 

💡 Key Implementation Details 

* All timestamps are stored in UTC to ensure consistency across regions and systems 
* Built using PayPal Sandbox for safe testing; credentials can be updated to enable live payments 
* Cloud deployment follows security best practices: secrets are managed securely via Google Cloud Run, never committed to version control 
* API endpoints use standard HTTP status codes for predictable error handling and integration 
* Deployment workflow supports continuous delivery via Git and Cloud Run 

📋 Project Status 

✅ Fully Completed & Production‑Ready 

All core functionality is implemented, tested, and deployed. The system operates reliably online, with all data persisted securely and all flows working as intended. 

🎯 Skills Demonstrated 

* Full‑stack backend development with TypeScript and NestJS 
* Third‑party API integration, secure authentication, and payment workflow implementation 
* Database design, schema migration, and persistent data management with Prisma ORM and PostgreSQL 
* Infrastructure as Code with Terraform — industry‑standard approach for version‑controlled, reproducible, and consistent cloud deployments 
* Serverless architecture deployment, IAM permission configuration, and secure environment hardening on Google Cloud Platform 
* Real‑world troubleshooting: resolving API enablement issues, resource conflicts, access restrictions, and Terraform state sync 
* development practices: separating environment configurations, protecting secrets, and avoiding hard‑coded credentials 
* Professional Git version control, technical documentation, and production‑grade software development best practices 

 


 

 

 
