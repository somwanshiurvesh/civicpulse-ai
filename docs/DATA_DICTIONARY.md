# Data Dictionary

Detailed information on database fields, validations, and downstream nullable fields.

| Field Name | Source Table | Data Type | Validation Rules / Description |
| :--- | :--- | :--- | :--- |
| `issue_id` | `issues` | `VARCHAR(20)` | **Primary Key**. Human-readable ID formatted as `CP-YYYY-XXXXXX` (e.g. `CP-2026-000123`). |
| `user_id` | `issues` | `VARCHAR(50)` | Foreign key referencing the `users` table. Represents the citizen who reported the issue. |
| `description` | `issues` | `TEXT` | Minimum length enforced client-side (e.g. 10 chars). Free-text field describing the issue. |
| `category` | `issues` | `VARCHAR(30)` | Enforced via Enum values (see [docs/ENUMS.md](file:///c:/Users/somva/civicpulse-ai/docs/ENUMS.md)). User selected category. |
| `subcategory` | `issues` | `VARCHAR(30)` | Enforced via Enum values. Refines the primary category (e.g., `POTHOLE` for `ROAD`). |
| `lat` | `issues` | `DECIMAL(9,6)` | Latitude coordinate of the issue location (EPSG:4326). |
| `lng` | `issues` | `DECIMAL(9,6)` | Longitude coordinate of the issue location (EPSG:4326). |
| `location` | `issues` | `GEOMETRY` | PostGIS spatial point (`SRID=4326`). Generated from lat and lng coordinates. Used for radius calculations. |
| `status` | `issues` | `VARCHAR(20)` | Enforced via Enum values. Tracks lifecycle (initialized as `SUBMITTED`). |
| `created_at` | `issues` | `TIMESTAMP` | Timestamp with timezone indicating when the issue was created. |
| `updated_at` | `issues` | `TIMESTAMP` | Timestamp with timezone representing the last edit. |

---

## ↙️ Downstream Nullable Fields

These fields are present on the `issues` table row but are initialized as `NULL` and subsequently written by downstream modules:

*   **`priority`** (decimal/int): Priority score calculated by the Priority/Authority engine.
*   **`ai_category`** (string): Category predicted by the AI model. Used to cross-verify client category selection.
*   **`ai_confidence`** (decimal): AI classification confidence level (between 0.00 and 1.00).
*   **`duplicate_of`** (string): References another `issue_id` if the duplicate detection module flags this issue as a duplicate.
*   **`authority_id`** (string): References the department or authority assigned to resolve the issue.
*   **`ai_status`** (string): Current status of the AI job (e.g., `PENDING`, `COMPLETED`, `FAILED`).
