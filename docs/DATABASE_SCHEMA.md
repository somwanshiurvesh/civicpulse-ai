# Database Schema (Normalized layout)

To maintain clean service boundaries, we do not pack all fields into a single bloated table. Tables are normalized and separated by module ownership.

---

## 🏗️ Table Schema Definitions

### 1. `users`
Centralized identity table containing citizens and authorities.
*   `id`: `VARCHAR(50) PRIMARY KEY`
*   `name`: `VARCHAR(100)`
*   `email`: `VARCHAR(100) UNIQUE`
*   `role`: `VARCHAR(20)`

### 2. `issues`
Core entity. Contains ONLY the ID, location, user reference, timestamps, and current status/category.
*   `issue_id`: `VARCHAR(20) PRIMARY KEY` (format: `CP-YYYY-XXXXXX`)
*   `user_id`: `VARCHAR(50) REFERENCES users(id)`
*   `description`: `TEXT`
*   `category`: `VARCHAR(30)`
*   `subcategory`: `VARCHAR(30)`
*   `lat`: `DECIMAL(9,6)`
*   `lng`: `DECIMAL(9,6)`
*   `location`: `GEOMETRY(Point, 4326)` (PostGIS spatial point)
*   `status`: `VARCHAR(20)`
*   `created_at`: `TIMESTAMP WITH TIME ZONE`
*   `updated_at`: `TIMESTAMP WITH TIME ZONE`

### 3. `issue_media`
Stores 1-to-many references to images or videos.
*   `id`: `SERIAL PRIMARY KEY`
*   `issue_id`: `VARCHAR(20) REFERENCES issues(issue_id) ON DELETE CASCADE`
*   `media_url`: `TEXT`
*   `created_at`: `TIMESTAMP WITH TIME ZONE`

### 4. `issue_status_history`
Audit trail of status changes.
*   `id`: `SERIAL PRIMARY KEY`
*   `issue_id`: `VARCHAR(20) REFERENCES issues(issue_id) ON DELETE CASCADE`
*   `status`: `VARCHAR(20)`
*   `changed_by`: `VARCHAR(50) REFERENCES users(id)`
*   `comments`: `TEXT`
*   `changed_at`: `TIMESTAMP WITH TIME ZONE`

---

## 🔒 Module Boundaries & Ownership

*   **Issue Reporting (Your Module)**: Has write ownership over the `issues` and `issue_media` tables. Must write initial state (`status = 'SUBMITTED'`).
*   **AI Service**: Appends predictions to the `issue_ai_analysis` table (1-to-1 mapping with `issues`). Must not update core columns directly.
*   **Duplicate Detection**: Creates entries in `issue_duplicates` mapping duplicate reports to a parent report.
*   **Priority & Authority**: Creates entries in `issue_assignments` mapping issues to departments or field workers.
