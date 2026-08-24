# API Contract & JSON Payloads

All REST APIs across the entire CivicPulse AI ecosystem (both Node.js and Python microservices) must strictly adhere to the following contracts.

---

## 🎨 Global Conventions
*   **JSON Field Case**: Use `snake_case` for all keys.
*   **Authentication Header**: Attach JSON Web Tokens in the authorization header:
    ```http
    Authorization: Bearer <token>
    ```
*   **Timestamps**: All timestamps returned must use ISO 8601 UTC format (e.g., `2026-08-18T21:54:33Z`).
*   **Geospatial Coords**: Latitude and longitude are passed as decimal float coordinates in payloads:
    *   `latitude`: decimal
    *   `longitude`: decimal

---

## 📦 Response Wrappers

### Success Format (HTTP 2xx)
```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {
    "key_1": "value",
    "key_2": 123
  }
}
```

### Error Format (HTTP 4xx / 5xx)
```json
{
  "success": false,
  "message": "Human-readable error explanation.",
  "error_code": "ERR_SPECIFIC_CODE"
}
```

---

## 🔗 Proposed REST Endpoints (Reporting Module)

### 1. `POST /api/issues`
Creates a new civic issue report.
*   **Request Body**:
    ```json
    {
      "description": "Massive pothole causing traffic slowdowns.",
      "category": "ROAD",
      "subcategory": "POTHOLE",
      "latitude": 18.5204,
      "longitude": 73.8567,
      "media_urls": [
        "https://bucket.s3.amazonaws.com/pothole1.jpg"
      ]
    }
    ```
*   **Response Data**:
    ```json
    {
      "issue_id": "CP-2026-000123",
      "status": "SUBMITTED"
    }
    ```

### 2. `GET /api/issues/:id`
Fetches a single issue by its unique human-readable ID.
*   **Response Data**: Full issue record representation.

### 3. `GET /api/issues/my`
Lists reports filed by the authenticated user.
*   **Response Data**: Array of issue summary items.

### 4. `GET /api/issues/:id/status`
Retrieves the state lifecycle and historical log for tracking.
*   **Response Data**: `{ "status": "SUBMITTED", "status_history": [...] }`

### 5. `POST /api/issues/:id/media`
Appends an image/video reference to an existing issue.
