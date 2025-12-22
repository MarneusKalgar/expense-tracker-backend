import "@typespec/http";

import "./models.tsp";

using Http;

@service(#{
  title: "Health"
})

namespace HealthChecking;

@route("/health")
@tag("Health")
@get
op healthCheck():
  | HealthCheckOkResponse
  | HealthCheckErrorResponse;

@route("/ready")
@tag("Health")
@get
op readinessCheck():
  | ReadinessCheckOkResponse
  | HealthCheckErrorResponse;

@route("/live")
@tag("Health")
@get
op livenessCheck():
  | LivenessCheckOkResponse
  | HealthCheckErrorResponse;
