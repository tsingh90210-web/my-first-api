# Terraform Infrastructure

This folder defines the cloud infrastructure for the project using Infrastructure as Code.

## Resources Managed
- Google Cloud Run service
- IAM permissions
- Environment variables

## Workflow
```bash
terraform init
terraform fmt
terraform validate
terraform plan
terraform apply

> ⚠️ **Note:** The live Cloud Run service for this API was deployed manually via the GCP Console. This Terraform configuration demonstrates Infrastructure as Code best practices — you'll need your own GCP project and credentials to run `terraform apply`.
