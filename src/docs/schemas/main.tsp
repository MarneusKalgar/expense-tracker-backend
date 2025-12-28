import "@typespec/http";
import "@typespec/versioning";

import "./health/routes.tsp";
import "./v1/auth/routes.tsp";

using Http;
using Versioning;
@service(#{
  title: "Expense Tracker API",
})
@server("http://localhost:3000", "Dev Server")
@versioned(Versions)

namespace ExpenseTrackerAPI;

enum Versions {
  v1: "1.0",
  v2: "2.0",
}
