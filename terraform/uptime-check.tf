resource "google_monitoring_uptime_check_config" "api_health_check" {
  display_name = "My-First-API-Uptime-Check"
  period       = "60s"
  timeout      = "5s"

  http_check {
    path         = "/paypal/health"
    port         = 443
    use_ssl      = true
    validate_ssl = true
  }

  monitored_resource {
    type = "uptime_url"
    labels = {
      project_id = "project-cde1593b-cb6c-47e3-b5d"
      host       = "my-first-api-hgs5o2ioua-nw.a.run.app"
    }
  }
}

resource "google_monitoring_alert_policy" "api_down_alert" {
  display_name = "Alert: API is down"
  combiner     = "OR"

  conditions {
    display_name = "Uptime check failed"
    condition_threshold {
      filter          = "metric.type=\"monitoring.googleapis.com/uptime_check/check_passed\" AND metric.label.check_id=\"${google_monitoring_uptime_check_config.api_health_check.uptime_check_id}\" AND resource.type=\"uptime_url\""
      duration        = "300s"
      comparison      = "COMPARISON_GT"
      threshold_value = 1

      aggregations {
        alignment_period     = "1200s"
        per_series_aligner   = "ALIGN_NEXT_OLDER"
        cross_series_reducer = "REDUCE_COUNT_FALSE"
        group_by_fields      = ["resource.label.*"]
      }
    }
  }
}
