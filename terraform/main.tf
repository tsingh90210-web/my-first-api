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
  name     = "my-first-api"
  location = var.gcp_region

  template {
    spec {
      containers {
        image = "europe-west2-docker.pkg.dev/project-cde1593b-cb6c-47e3-b5d/api/my-first-api:latest"
      }
    }
  }
}
