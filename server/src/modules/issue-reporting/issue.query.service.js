const { query } = require('../../config/db');

/**
 * IssueQueryService - handles read-only retrieval of issues.
 * Strictly scoped to: GET /api/issues/:id, GET /api/issues/my, GET /api/issues/:id/status
 */
class IssueQueryService {
  /**
   * Fetch a single issue by issue_id.
   * Returns full issue record including media and status history.
   *
   * @param {string} issueId - Human-readable issue ID (CP-YYYY-XXXXXX)
   * @returns {Promise<object|null>}
   */
  static async getIssueById(issueId) {
    const issueRes = await query(
      `SELECT
        i.issue_id,
        i.user_id,
        i.description,
        i.category,
        i.subcategory,
        i.lat::float AS lat,
        i.lng::float AS lng,
        ST_AsGeoJSON(i.location)::json AS location,
        i.status,
        i.created_at,
        i.updated_at
       FROM issues i
       WHERE i.issue_id = $1;`,
      [issueId]
    );

    if (issueRes.rows.length === 0) return null;

    const issue = issueRes.rows[0];

    // Fetch associated media
    const mediaRes = await query(
      `SELECT id, media_url, created_at
       FROM issue_media
       WHERE issue_id = $1
       ORDER BY id ASC;`,
      [issueId]
    );
    issue.media = mediaRes.rows;

    // Fetch status history (chronological order: oldest first)
    const historyRes = await query(
      `SELECT id, status, changed_by, comments, changed_at
       FROM issue_status_history
       WHERE issue_id = $1
       ORDER BY changed_at ASC;`,
      [issueId]
    );
    issue.status_history = historyRes.rows;

    return issue;
  }

  /**
   * List issues filed by a specific user, paginated.
   * Assumption (unspecified in docs): returns page/limit pagination matching
   * standard project conventions (page=1, limit=10).
   *
   * @param {string} userId
   * @param {number} page
   * @param {number} limit
   * @returns {Promise<{ issues: object[], total: number, page: number, limit: number }>}
   */
  static async getIssuesByUser(userId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const countRes = await query(
      `SELECT COUNT(*) AS total FROM issues WHERE user_id = $1;`,
      [userId]
    );
    const total = parseInt(countRes.rows[0].total, 10);

    const issuesRes = await query(
      `SELECT
        issue_id,
        user_id,
        description,
        category,
        subcategory,
        lat::float AS lat,
        lng::float AS lng,
        status,
        created_at,
        updated_at
       FROM issues
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3;`,
      [userId, limit, offset]
    );

    return {
      issues: issuesRes.rows,
      total,
      page,
      limit,
    };
  }

  /**
   * Fetch the status lifecycle for a single issue.
   *
   * @param {string} issueId
   * @returns {Promise<{ status: string, status_history: object[] }|null>}
   */
  static async getIssueStatus(issueId) {
    const issueRes = await query(
      `SELECT issue_id, status FROM issues WHERE issue_id = $1;`,
      [issueId]
    );

    if (issueRes.rows.length === 0) return null;

    const { status } = issueRes.rows[0];

    const historyRes = await query(
      `SELECT id, status, changed_by, comments, changed_at
       FROM issue_status_history
       WHERE issue_id = $1
       ORDER BY changed_at ASC;`,
      [issueId]
    );

    return {
      issue_id: issueId,
      status,
      status_history: historyRes.rows,
    };
  }
}

module.exports = IssueQueryService;
