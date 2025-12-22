import "@typespec/http";

using Http;

enum Error {
  Connected: "connected",
  Disconnected: "disconnected",
  Unknown: "unknown",
}

enum Status {
  Degraded: "degraded",
  Down: "down",
  Ok: "ok",
}

model Service {
  database: Error,
  redis: Error,
}

model HealthCheck {
  services: Service;
  status: Status;
  timestamp: string;
  uptime: int32;
}

model ReadinessCheck {
  services: Service;
  status: Status;
}

model LivenessCheck {
  timestamp: string;
}

model HealthCheckOkResponse {
  ...OkResponse,
  ...Body<HealthCheck>,
}

model ReadinessCheckOkResponse {
  ...OkResponse,
  ...Body<ReadinessCheck>,
}

model LivenessCheckOkResponse {
  ...OkResponse,
  ...Body<LivenessCheck>,
}

@error
model InternalServerError {
  code: "INTERNAL_SERVER_ERROR",
  message: "Service Unavailable",
}

model HealthCheckErrorResponse {
  @statusCode statusCode: 503;
  @body error: InternalServerError;
}