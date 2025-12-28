import "@typespec/http";

using Http;

// Request models
@doc("User registration input data")
model SignupInput {
  @doc("User's email address (must be unique)")
  @example("john.doe@example.com")
  email: string;
  @doc("User's first name")
  @minLength(2)
  @maxLength(50)
  @example("John")
  firstName: string;
  @doc("User's last name")
  @minLength(2)
  @maxLength(50)
  @example("Doe")
  lastName: string;
  @doc("User's password (minimum 6 characters)")
  @minLength(6)
  @secret
  @example("SecurePass123!")
  password: string;
}

@doc("User login credentials")
model LoginInput {
  @doc("User's registered email address")
  @example("john.doe@example.com")
  email: string;
  @doc("User's password")
  @minLength(6)
  @secret
  @example("SecurePass123!")
  password: string;
}

// Response data models
@doc("Signup response data containing the newly created user ID")
model SignupData {
  @doc("Unique identifier of the newly created user")
  @example("550e8400-e29b-41d4-a716-446655440000")
  userId: string;
}

@doc("Login response data with authentication tokens")
model LoginData {
  @doc("JWT access token for authenticated requests")
  @example("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
  accessToken: string;
  @doc("Unique identifier of the authenticated user")
  @example("550e8400-e29b-41d4-a716-446655440000")
  userId: string;
}

@doc("Refresh token response data with new access token")
model RefreshTokenData {
  @doc("New JWT access token")
  @example("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
  accessToken: string;
}

// Success response models
@doc("Successful user registration response (201)")
model SignupResponse {
  @statusCode statusCode: 201;
  @body body: {
    @doc("Indicates successful operation")
    success: true;
    @doc("Success message")
    message: "User created successfully. Please log in.";
    @doc("Response data containing user ID")
    data: SignupData;
  };
}

@doc("Successful login response (200)")
model LoginResponse {
  @statusCode statusCode: 200;
  @body body: {
    @doc("Indicates successful operation")
    success: true;
    @doc("Success message")
    message: "Login successful";
    @doc("Response data containing tokens and user ID")
    data: LoginData;
  };
}

@doc("Successful token refresh response (200)")
model RefreshTokenResponse {
  @statusCode statusCode: 200;
  @body body: {
    @doc("Indicates successful operation")
    success: true;
    @doc("Success message")
    message: "Access token refreshed successfully";
    @doc("Response data containing new access token")
    data: RefreshTokenData;
  };
}

@doc("Successful logout response (200)")
model LogoutResponse {
  @statusCode statusCode: 200;
  @body body: {
    @doc("Indicates successful operation")
    success: true;
    @doc("Success message")
    message: "Logout successful";
  };
}

@doc("Internal server error response (500)")
model InternalServerErrorResponse {
  @statusCode statusCode: 500;
  @body error: InternalServerError;
}
