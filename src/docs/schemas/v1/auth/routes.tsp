import "@typespec/http";
import "@typespec/versioning";

import "./models.tsp";

using Http;
using Versioning;

@versioned(Versions)

@route("/api/v1/auth")
namespace ExpenseTrackerAPI.Authentication;

@doc("Register a new user account")
@route("/signup")
@tag("Authentication")
@added(Versions.v1)
@post
op signup(
  @doc("User registration data")
  @body body: SignupInput
):
  | SignupResponse
  | BadRequestResponse
  | ConflictResponse
  | InternalServerErrorResponse;

@doc("Authenticate user and obtain access token")
@route("/login")
@tag("Authentication")
@added(Versions.v1)
@post
op login(
  @doc("User login credentials")
  @body body: LoginInput
):
  | LoginResponse
  | BadRequestResponse
  | UnauthorizedResponse
  | InternalServerErrorResponse;

@doc("Refresh the access token using refresh token cookie")
@route("/refresh-token")
@tag("Authentication")
@added(Versions.v1)
@post
op refreshToken():
  | RefreshTokenResponse
  | UnauthorizedResponse
  | InternalServerErrorResponse;

@doc("Logout user and invalidate tokens")
@route("/logout")
@tag("Authentication")
@added(Versions.v1)
@post
op logout():
  | LogoutResponse
  | UnauthorizedResponse
  | InternalServerErrorResponse;
