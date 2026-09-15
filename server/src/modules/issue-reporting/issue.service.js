const { getClient } = require('../../config/db');

/**
 * Service handling civic issue reporting persistence, ID generation,
 * PostGIS spatial mapping, media referencing, and audit logging.
 */
class IssueService {
  /**
   * Create a new civic issue.
   * Flow: JWT validation → input validation → Issue ID generation → DB insert → SUBMITTED status history → standard response
   *
   * @param {string} userId - ID of authenticated user
   * @param {object} issueData - Validated payload { description, category, subcategory, latitude, longitude, media_urls }
   * @returns {Promise<{ issue_id: string, status: string, created_at: Date }>}
   */
  static async createIssue(userId, issueData) {
    const client = await getClient();

    try {
      await client.query('BEGIN');

      // 1. Generate unique Issue ID (CP-YYYY-XXXXXX)
      const year = new Date().getUTCFullYear();
      const seqRes = await client.query("SELECT nextval('issue_id_seq') AS seq;");
      const seqNum = String(seqRes.rows[0].seq).padStart(6, '0');
      const issueId = `CP-${year}-${seqNum}`;

      const {
        description,
        category,
        subcategory,
        latitude,
        longitude,
        media_urls = [],
      } = issueData;

      // 2. Insert into issues table
      // Note: ST_MakePoint takes (longitude, latitude) -> (x, y)
      const insertIssueSql = `
        INSERT INTO issues (
          issue_id,
          user_id,
          description,
          category,
          subcategory,
          lat,
          lng,
          location,
          status
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          ST_SetSRID(ST_MakePoint($8, $9), 4326),
          'SUBMITTED'
        )
        RETURNING issue_id, user_id, description, category, subcategory, lat, lng, status, created_at, updated_at;
      `;

      const issueParams = [
        issueId,
        userId,
        description,
        category,
        subcategory || null,
        latitude,
        longitude,
        longitude,
        latitude,
      ];

      const { rows: issueRows } = await client.query(insertIssueSql, issueParams);
      const createdIssue = issueRows[0];

      // 3. Insert media records into issue_media
      if (media_urls && media_urls.length > 0) {
        for (const mediaUrl of media_urls) {
          await client.query(
            `INSERT INTO issue_media (issue_id, media_url) VALUES ($1, $2);`,
            [issueId, mediaUrl]
          );
        }
      }

      // 4. Record initial audit trail into issue_status_history
      await client.query(
        `INSERT INTO issue_status_history (issue_id, status, changed_by, comments)
         VALUES ($1, 'SUBMITTED', $2, $3);`,
        [issueId, userId, 'Initial issue submission via API']
      );

      await client.query('COMMIT');

      return {
        issue_id: createdIssue.issue_id,
        status: createdIssue.status,
        created_at: createdIssue.created_at,
      };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}

module.exports = IssueService;
