# Integration Rules & Anti-Patterns

Rules to guarantee friction-free integration within the CivicPulse AI project ecosystem.

---

## 🚫 Critical Anti-Patterns

1.  **Do Not Create Secondary Auth**: Use the central user entity. All secure endpoints must consume standard JWT verification.
2.  **Do Not Duplicate Entities**: Maintain single source of truth for the `User` and `Issue` entities.
3.  **Do Not Invent Formats**: Standardize on coordinates as `latitude`/`longitude` JSON fields, dates as ISO 8601 strings, and issue IDs as `CP-YYYY-XXXXXX`. Do not pass integers or raw UUIDs for issue references in APIs.
4.  **No Direct Table Writing**: Respect module boundaries. Issue Reporting must not write to AI or Priority tables. AI and other services must not update core columns in the `issues` table.
5.  **No Secrets in Git**: Never commit `.env` or production credentials. Keep them local.
6.  **No Silent Contract Changes**: Discuss API or database schema adjustments with the team before executing.

---

## 🏗️ Git Rules
*   Never push directly to `main` or `develop`.
*   All merges must come through Pull Requests.
*   Must get at least one review approval for integration level PRs.
*   Pull `develop` daily and merge it into your feature branches.
*   Write clear commits, e.g., `feat(reporting): integrate location coordinates validations`.
