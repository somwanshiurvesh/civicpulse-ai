# Allowed Enums & Categories

To prevent data drift and ensure integrity across the pipeline, all inputs must conform to these exact string constants.

---

## 🚦 Status Values (`status`)

These states represent the lifecycle of a reported civic issue.

*   `SUBMITTED` — Saved successfully; awaiting moderation/review (initial state).
*   `UNDER_REVIEW` — AI or human moderation checks currently in progress.
*   `VERIFIED` — Confirmed genuine and verified not to be a duplicate or spam.
*   `ASSIGNED` — Routed to the responsible municipal authority/department.
*   `IN_PROGRESS` — The assigned authority is actively working to resolve the issue.
*   `RESOLVED` — Action completed; pending confirmation from the reporting citizen.
*   `CLOSED` — Final closed state; no further actions can be taken.
*   `DUPLICATE` — Flagged and merged into a parent issue report.
*   `REJECTED` — Invalid, spam, out of scope, or non-actionable submission.

---

## 🏷️ Category Values (`category`)

These constants are used for routing reports to correct departments.

*   `ROAD` (e.g. subcategories: `POTHOLE`, `MANHOLE`, `DIVIDER`)
*   `WASTE` (e.g. subcategories: `GARBAGE`, `DUMPING`, `PLASTIC`)
*   `WATER` (e.g. subcategories: `LEAKAGE`, `CONTAMINATION`, `LOW_PRESSURE`)
*   `DRAINAGE` (e.g. subcategories: `OVERFLOW`, `BLOCKAGE`, `STAGNANT`)
*   `STREETLIGHT` (e.g. subcategories: `BROKEN`, `NON_FUNCTIONAL`)
*   `TRAFFIC` (e.g. subcategories: `SIGNAL_BROKEN`, `SIGNAGE_MISSING`)
*   `PUBLIC_INFRASTRUCTURE` (e.g. subcategories: `BENCH_BROKEN`, `PARK_DAMAGE`)
*   `OTHER` (Catch-all for miscellaneous submissions)
