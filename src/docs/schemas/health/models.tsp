import "@typespec/http";

using Http;

@doc("Service connection status")
enum Error {
  @doc("Service is connected and operational")
  Connected: "connected",
  @doc("Service is disconnected")
  Disconnected: "disconnected",
  @doc("Service connection status is unknown")
  Unknown: "unknown",
}

@doc("Overall system health status")
enum Status {
  @doc("Service is operational but with degraded performance")
  Degraded: "degraded",
  @doc("Service is not operational")
  Down: "down",
  @doc("Service is fully operational")
  Ok: "ok",
}

@doc("External service connection statuses")
model Service {
  @doc("Database connection status")
  database: Error,
  @doc("Redis connection status")
  redis: Error,
}

@doc("Comprehensive health check response with service statuses")
model HealthCheck {
  @doc("Status of external services")
  services: Service;
  @doc("Overall system health status")
  status: Status;
  @doc("ISO 8601 timestamp of the health check")
  @example("2025-12-28T10:30:00.000Z")
  timestamp: string;
  @doc("Server uptime in seconds")
  @example(3600)
  uptime: int32;
}

@doc("Readiness check response indicating if the service can handle requests")
model ReadinessCheck {
  @doc("Status of external services")
  services: Service;
  @doc("Overall readiness status")
  status: Status;
}

@doc("Liveness check response indicating if the service is running")
model LivenessCheck {
  @doc("ISO 8601 timestamp of the liveness check")
  @example("2025-12-28T10:30:00.000Z")
  timestamp: string;
}

@doc("Successful health check response (200)")
model HealthCheckOkResponse {
  ...OkResponse,
  ...Body<HealthCheck>,
}

@doc("Successful readiness check response (200)")
model ReadinessCheckOkResponse {
  ...OkResponse,
  ...Body<ReadinessCheck>,
}

@doc("Successful liveness check response (200)")
model LivenessCheckOkResponse {
  ...OkResponse,
  ...Body<LivenessCheck>,
}

@doc("Internal server error details")
@error
model InternalServerError {
  @doc("Error code identifier")
  code: "INTERNAL_SERVER_ERROR",
  @doc("Human-readable error message")
  message: "Service Unavailable",
}

@doc("Service unavailable error response (503)")
model HealthCheckErrorResponse {
  @statusCode statusCode: 503;
  @body error: InternalServerError;
}