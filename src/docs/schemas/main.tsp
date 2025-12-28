import "@typespec/http";
import "@typespec/versioning";

import "./health/routes.tsp";
import "./v1/auth/routes.tsp";

using Http;
using Versioning;

@doc("Expense Tracker API - Manage your personal expenses with ease")
@service(#{
  title: "Expense Tracker API",
})
@server("http://localhost:3000", "Dev Server")
@versioned(Versions)

namespace ExpenseTrackerAPI;

@doc("Available API versions")
enum Versions {
  @doc("Version 1.0")
  v1: "1.0",
  @doc("Version 2.0")
  v2: "2.0",
}
