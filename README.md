Payment Processing System

A production-ready end-to-end payment application built with modern backend technologies, fully deployed and tested on Google Cloud Run.

🚀 Live Deployment

All services are fully operational and accessible online:

• Payment Form: https://my-first-api-801597296257.europe-west2.run.app/pay
• Payment History Dashboard: https://my-first-api-801597296257.europe-west2.run.app/pay/dashboard
• Interactive API Documentation: https://my-first-api-801597296257.europe-west2.run.app/api-docs

📋 Project Overview
This project delivers a complete, secure payment processing solution with full PayPal integration, designed for reliability, maintainability, and real-world use. It follows industry best practices for API development, environment management, and cloud deployment — transforming a basic implementation into a fully functional production-grade application with persistent data storage.

🛠️ Technology Stack

• Backend Framework: NestJS (TypeScript) – scalable, modular, type-safe architecture
• Database ORM: Prisma – type-safe database interactions and schema migrations
• Payment Gateway: PayPal REST API (Sandbox environment) – secure end-to-end transaction flows
• Database: Supabase (PostgreSQL) – persistent, cloud-hosted relational data storage
• Cloud Hosting: Google Cloud Run – fully managed serverless deployment with automatic scaling
• API Documentation: Swagger / OpenAPI – fully interactive, testable API documentation
• DevOps & Tools: Git, npm, Docker, dotenv – version control, dependency management, and secure environment handling


✨ Core Features

✅ Complete PayPal Payment Flow: End-to-end order creation, user approval, and payment capture
✅ Smart Redirect Handling: Dedicated success and cancellation pages, with no broken links or local environment errors
✅ Persistent Data Storage: All transactions saved permanently to a PostgreSQL database, with full history and status tracking
✅ Payment Dashboard: Clear, real-time view of all completed payments with timestamps and details
✅ Secure Configuration: All credentials and secrets managed via environment variables — no hardcoded sensitive data
✅ Environment Separation: Clear distinction between local development and live production environments
✅ Responsive UI: Clean, accessible payment form and dashboard
✅ Full Test Coverage: All flows tested end-to-end, with consistent behaviour across environments

📦 Local Setup (For Development)

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

📝 Key Implementation Details

• All timestamps are stored in UTC to ensure consistency across regions and systems
• Built using PayPal Sandbox for safe testing; credentials can be updated to enable live payments
• Cloud deployment follows security best practices: secrets are managed securely via Google Cloud Run, never committed to version control
• API endpoints use standard HTTP status codes for predictable error handling and integration
• Deployment workflow supports continuous delivery via Git and Cloud Run

📈 Project Status

✅ Fully Completed & Production-Ready
All core functionality is implemented, tested, and deployed. The system operates reliably online, with all data persisted securely and all flows working as intended.

🎯 Skills Demonstrated

• Full-stack backend development with TypeScript and NestJS
• Third-party API integration and authentication
• Database design, migration, and persistent data management
• Cloud deployment, environment configuration, and production hardening
• Debugging, end-to-end testing, and problem-solving
• Professional documentation and software development best practices
