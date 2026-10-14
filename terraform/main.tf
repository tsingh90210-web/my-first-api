terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.gcp_project_id
  region  = var.gcp_region
}

resource "google_cloud_run_service" "api" {
  name     = "payment-api"
  location = var.gcp_region

  template {
    spec {
      containers {
        image = "europe-west2-docker.pkg.dev/${var.gcp_project_id}/payment-api/api:latest"
        ports {
          container_port = 8080
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}
