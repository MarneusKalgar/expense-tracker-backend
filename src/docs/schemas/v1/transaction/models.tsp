import "@typespec/http";

using Http;

// Enums
@doc("Transaction type classification")
enum TransactionType {
  @doc("Expense transaction")
  Expense: "expense",
  @doc("Income transaction")
  Income: "income",
  @doc("Transfer between accounts")
  Transfer: "transfer",
}

// Request models
@doc("Transaction creation input data")
model CreateTransactionInput {
  @doc("UUID of the account for this transaction")
  @example("550e8400-e29b-41d4-a716-446655440000")
  accountId: string;
  @doc("Transaction amount (must be positive)")
  @example(150.50)
  amount: float64;
  @doc("UUID of the transaction category")
  @example("660e8400-e29b-41d4-a716-446655440001")
  categoryId: string;
  @doc("Transaction date (ISO 8601 format)")
  date: plainDate;
  @doc("Transaction name/description")
  @minLength(1)
  @maxLength(100)
  @example("Grocery shopping")
  name: string;
  @doc("Type of transaction")
  type: TransactionType;
}

@doc("Transaction update input data (all fields optional)")
model UpdateTransactionInput {
  @doc("UUID of the account for this transaction")
  @example("550e8400-e29b-41d4-a716-446655440000")
  accountId?: string;
  @doc("Transaction amount (must be positive)")
  @example(175.75)
  amount?: float64;
  @doc("UUID of the transaction category")
  @example("660e8400-e29b-41d4-a716-446655440001")
  categoryId?: string;
  @doc("Transaction date (ISO 8601 format)")
  date?: plainDate;
  @doc("Transaction name/description")
  @minLength(1)
  @maxLength(100)
  @example("Updated grocery shopping")
  name?: string;
}

// Response data models
@doc("Account information")
model AccountInfo {
  @doc("Account UUID")
  @example("550e8400-e29b-41d4-a716-446655440000")
  id: string;
  @doc("Account name")
  @example("Main Checking")
  name: string;
}

@doc("Category information")
model CategoryInfo {
  @doc("Category UUID")
  @example("660e8400-e29b-41d4-a716-446655440001")
  id: string;
  @doc("Category name")
  @example("Groceries")
  name: string;
}

@doc("Transaction details")
model TransactionData {
  @doc("Associated account information")
  account: AccountInfo;
  @doc("Transaction amount")
  @example(150.50)
  amount: float64;
  @doc("Associated category information")
  category: CategoryInfo;
  @doc("Transaction creation timestamp")
  createdAt: utcDateTime;
  @doc("Transaction date")
  date: utcDateTime;
  @doc("Transaction UUID")
  @example("770e8400-e29b-41d4-a716-446655440002")
  id: string;
  @doc("Transaction name/description")
  @example("Grocery shopping")
  name: string;
  @doc("Transaction type")
  type: TransactionType;
  @doc("Last update timestamp")
  updatedAt: utcDateTime;
}

@doc("Transaction creation response data")
model CreateTransactionData {
  @doc("UUID of the newly created transaction")
  @example("770e8400-e29b-41d4-a716-446655440002")
  transactionId: string;
}

// Success response models
@doc("Successful transaction retrieval response (200)")
model GetTransactionResponse {
  @statusCode statusCode: 200;
  @body body: {
    @doc("Indicates successful operation")
    success: true;
    @doc("Success message")
    message: "Fetched transaction successfully";
    @doc("Transaction data")
    data: TransactionData;
  };
}

@doc("Successful transactions list retrieval response (200)")
model GetAllTransactionsResponse {
  @statusCode statusCode: 200;
  @body body: {
    @doc("Indicates successful operation")
    success: true;
    @doc("Success message")
    message: "Fetched all transactions";
    @doc("Array of transaction data")
    data: TransactionData[];
  };
}

@doc("Successful transaction creation response (201)")
model CreateTransactionResponse {
  @statusCode statusCode: 201;
  @body body: {
    @doc("Indicates successful operation")
    success: true;
    @doc("Success message")
    message: "Transaction created successfully";
    @doc("Created transaction data")
    data: CreateTransactionData;
  };
}

@doc("Successful transaction update response (200)")
model UpdateTransactionResponse {
  @statusCode statusCode: 200;
  @body body: {
    @doc("Indicates successful operation")
    success: true;
    @doc("Success message")
    message: "Transaction updated successfully";
    @doc("Updated transaction data")
    data: TransactionData;
  };
}

@doc("Successful transaction deletion response (200)")
model DeleteTransactionResponse {
  @statusCode statusCode: 200;
  @body body: {
    @doc("Indicates successful operation")
    success: true;
    @doc("Success message")
    message: "Transaction deleted successfully";
  };
}