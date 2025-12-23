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

// Error response models
// @error
// model BadRequestError {
//   code: "BAD_REQUEST";
//   message: string;
// }

// @error
// model UnauthorizedError {
//   code: "UNAUTHORIZED";
//   message: string;
// }

// @error
// model ConflictError {
//   code: "CONFLICT";
//   message: string;
// }

// @error
// model InternalServerError {
//   code: "INTERNAL_SERVER_ERROR";
//   message: string;
// }

// model BadRequestResponse {
//   @statusCode statusCode: 400;
//   @body error: BadRequestError;
// }

// model UnauthorizedResponse {
//   @statusCode statusCode: 401;
//   @body error: UnauthorizedError;
// }

// model ConflictResponse {
//   @statusCode statusCode: 409;
//   @body error: ConflictError;
// }

model InternalServerErrorResponse {
  @statusCode statusCode: 500;
  @body error: InternalServerError;
}
