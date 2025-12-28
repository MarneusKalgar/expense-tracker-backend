import "@typespec/http";

using Http;

// Request models
model SignupInput {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

model LoginInput {
  email: string;
  password: string;
}

// Response data models
model SignupData {
  userId: string;
}

model LoginData {
  accessToken: string;
  userId: string;
}

model RefreshTokenData {
  accessToken: string;
}

// Success response models
model SignupResponse {
  @statusCode statusCode: 201;
  @body body: {
    success: true;
    message: "User created successfully. Please log in.";
    data: SignupData;
  };
}

model LoginResponse {
  @statusCode statusCode: 200;
  @body body: {
    success: true;
    message: "Login successful";
    data: LoginData;
  };
}

model RefreshTokenResponse {
  @statusCode statusCode: 200;
  @body body: {
    success: true;
    message: "Access token refreshed successfully";
    data: RefreshTokenData;
  };
}

model LogoutResponse {
  @statusCode statusCode: 200;
  @body body: {
    success: true;
    message: "Logout successful";
  };
}

model InternalServerErrorResponse {
  @statusCode statusCode: 500;
  @body error: InternalServerError;
}
