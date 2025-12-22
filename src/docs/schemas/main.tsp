import "@typespec/http";

import "./health/routes.tsp";

using Http;

@service(#{
  title: "Expense Tracker API",
})
@server("http://localhost:3000", "Single server endpoint")

namespace ExpenseTrackerAPI;
