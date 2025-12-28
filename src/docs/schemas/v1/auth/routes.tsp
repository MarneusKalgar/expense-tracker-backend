import "@typespec/http";
import "@typespec/versioning";

import "./models.tsp";

using Http;
using Versioning;

@versioned(Versions)

@route("/api/v1/auth")
namespace ExpenseTrackerAPI.Authentication;

@route("/signup")
@tag("Authentication")
@added(Versions.v1)
@post
op signup(@body body: SignupInput):
  | SignupResponse
  | BadRequestResponse
  | ConflictResponse
  | InternalServerErrorResponse;

@route("/login")
@tag("Authentication")
@added(Versions.v1)
@post
op login(@body body: LoginInput):
  | LoginResponse
  | BadRequestResponse
  | UnauthorizedResponse
  | InternalServerErrorResponse;

@route("/refresh-token")
@tag("Authentication")
@added(Versions.v1)
@post
op refreshToken():
  | RefreshTokenResponse
  | UnauthorizedResponse
  | InternalServerErrorResponse;

@route("/logout")
@tag("Authentication")
@added(Versions.v1)
@post
op logout():
  | LogoutResponse
  | UnauthorizedResponse
  | InternalServerErrorResponse;
