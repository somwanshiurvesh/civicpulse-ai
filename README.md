# CivicPulse AI

An AI-powered civic issue reporting and management platform. Citizens report problems (e.g., potholes, garbage, broken streetlights), and the system automatically routes them to the responsible civic authority.

---

## 📂 Project Structure

This project is organized as a monorepo containing decoupled services representing boundaries of concern:

*   `[client/](file:///c:/Users/somva/civicpulse-ai/client)` — React + Tailwind CSS v4 frontend.
*   `[server/](file:///c:/Users/somva/civicpulse-ai/server)` — Node.js + Express.js core orchestrator API backend.
*   `[ai/](file:///c:/Users/somva/civicpulse-ai/ai)` — Python worker service placeholder (ML/classification/scoring).
*   `[docs/](file:///c:/Users/somva/civicpulse-ai/docs)` — Shared project documentation.

---

## 🚀 Getting Started

### ⚙️ Prerequisites
Ensure you have the following installed locally:
*   Node.js (v24+)
*   Python (v3.11+)
*   Docker & Docker Compose

### 🛠️ Step 1: Environment Configuration
Copy the shared environment variables template:
```bash
cp .env.example .env
```

---

## ⚙️ Running Locally (Standalone Mode)

You can run each service independently for local development.

### 1. Backend Core API (`[server/](file:///c:/Users/somva/civicpulse-ai/server)`)
```bash
cd server
npm install
npm run dev
```
*   **Default Port**: `5000`
*   **Verification**: Open [http://localhost:5000/health](http://localhost:5000/health) in your browser. It should return a success wrapper:
    ```json
    {
      "success": true,
      "message": "Core API server is running and healthy.",
      "data": { "status": "UP" }
    }
    ```

### 2. Python AI Service (`[ai/](file:///c:/Users/somva/civicpulse-ai/ai)`)
```bash
cd ai
python main.py
```
*   **Default Port**: `5001`
*   **Verification**: Open [http://localhost:5001/health](http://localhost:5001/health) in your browser. It should return the success payload:
    ```json
    {
      "success": true,
      "message": "AI Worker Service placeholder is running.",
      "data": { "status": "UP" }
    }
    ```

### 3. React Frontend (`[client/](file:///c:/Users/somva/civicpulse-ai/client)`)
```bash
cd client
npm install
npm run dev
```
*   **Default Port**: `5173`
*   **Verification**: Open [http://localhost:5173](http://localhost:5173) in your browser to view the Status Dashboard showing dynamic connectivity to both backend and AI services.

---

## 🐳 Running with Docker Compose

To spin up the entire stack, including the PostgreSQL + PostGIS database:

```bash
docker-compose up --build
```

### Verification Ports:
*   **PostGIS DB**: `localhost:5432`
*   **Core Server**: [http://localhost:5000/health](http://localhost:5000/health)
*   **AI Service**: [http://localhost:5001/health](http://localhost:5001/health)
*   **Frontend client**: [http://localhost:5173](http://localhost:5173)

---

## 📝 Team & Branch Rules
*   **Branch Strategy**: `main` $\rightarrow$ `develop` $\rightarrow$ `feature/<module-name>-<task>`.
*   Direct pushes to `main` and `develop` are forbidden. Submit a PR for reviews.
*   Merge `develop` into your feature branch daily to prevent merge conflicts.