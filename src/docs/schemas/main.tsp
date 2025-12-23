import "@typespec/http";
import "@typespec/versioning";

import "./health/routes.tsp";
import "./auth/routes.tsp";

using Http;
using Versioning;

@service(#{
  title: "Expense Tracker API",
})
//@server("test", "Single server endpoint")
@versioned(Versions)

namespace ExpenseTrackerAPI;

enum Versions {
  v1: "1.0",
  v2: "2.0",
}
