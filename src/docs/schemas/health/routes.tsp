import "@typespec/http";

import "./models.tsp";

using Http;

namespace ExpenseTrackerAPI.HealthChecking;

@doc("Check overall health status of the application and its dependencies")
@route("/health")
@tag("Health")
@get
op healthCheck():
  | HealthCheckOkResponse
  | HealthCheckErrorResponse;

@doc("Check if the service is ready to accept traffic (Kubernetes readiness probe)")
@route("/ready")
@tag("Health")
@get
op readinessCheck():
  | ReadinessCheckOkResponse
  | HealthCheckErrorResponse;

@doc("Check if the service is alive and running (Kubernetes liveness probe)")
@route("/live")
@tag("Health")
@get
op livenessCheck():
  | LivenessCheckOkResponse
  | HealthCheckErrorResponse;
