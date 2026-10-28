resource "google_monitoring_uptime_check_config" "api_health_check" {
  display_name = "My‑First‑API‑Uptime‑Check"
  period       = "60s"
  timeout      = "5s"

  http_check {
    path = "/paypal/health"
    port = 443
  }

  monitored_resource {
    type = "cloud_run_revision"
    labels = {
      location     = "europe‑west2"
      service_name = "my‑first‑api"
    }
  }
}

resource "google_monitoring_alert_policy" "api_down_alert" {
  display_name = "Alert: API is down"
  conditions {
    display_name = "Uptime check failed"
    condition_threshold {
      filter          = "resource.type=\"cloud_run_revision\" AND metric.type=\"monitoring.googleapis.com/uptime_check/check_passed\""
      duration        = "300s"
      comparison      = "COMPARISON_LT"
      threshold_value = 0
    }
  }
}
