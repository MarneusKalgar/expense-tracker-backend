import "@typespec/http";
import "@typespec/versioning";

import "./models.tsp";
import "../auth/models.tsp";

using Http;
using Versioning;

@versioned(Versions)

@route("/api/v1/transactions")
namespace ExpenseTrackerAPI.Transactions;

@doc("Retrieve all transactions for the authenticated user")
@route("/")
@tag("Transactions")
@added(Versions.v1)
@useAuth(BearerAuth)
@get
op getAllTransactions(
  @doc("Search term to filter transactions by name")
  @query search?: string,
  @doc("Filter by category UUID")
  @query categoryId?: string,
  @doc("Filter by currency UUID")
  @query currencyId?: string,
  @doc("Filter by account UUID")
  @query accountId?: string,
  @doc("Page number for pagination")
  @query page?: int32,
  @doc("Number of items per page")
  @query perPage?: int32
):
  | GetAllTransactionsResponse
  | UnauthorizedResponse
  | InternalServerErrorResponse;

@doc("Retrieve a specific transaction by ID")
@route("/{id}")
@tag("Transactions")
@added(Versions.v1)
@useAuth(BearerAuth)
@get
op getTransaction(
  @doc("Transaction UUID")
  @path id: string
):
  | GetTransactionResponse
  | UnauthorizedResponse
  | NotFoundResponse
  | InternalServerErrorResponse;

@doc("Create a new transaction")
@route("/")
@tag("Transactions")
@added(Versions.v1)
@useAuth(BearerAuth)
@post
op createTransaction(
  @doc("Transaction creation data")
  @body body: CreateTransactionInput
):
  | CreateTransactionResponse
  | BadRequestResponse
  | UnauthorizedResponse
  | InternalServerErrorResponse;

@doc("Update an existing transaction")
@route("/{id}")
@tag("Transactions")
@added(Versions.v1)
@useAuth(BearerAuth)
@put
op updateTransaction(
  @doc("Transaction UUID")
  @path id: string,
  @doc("Transaction update data")
  @body body: UpdateTransactionInput
):
  | UpdateTransactionResponse
  | BadRequestResponse
  | UnauthorizedResponse
  | NotFoundResponse
  | ConflictResponse
  | InternalServerErrorResponse;

@doc("Delete a transaction (soft delete)")
@route("/{id}")
@tag("Transactions")
@added(Versions.v1)
@useAuth(BearerAuth)
@delete
op deleteTransaction(
  @doc("Transaction UUID")
  @path id: string
):
  | DeleteTransactionResponse
  | UnauthorizedResponse
  | NotFoundResponse
  | InternalServerErrorResponse;