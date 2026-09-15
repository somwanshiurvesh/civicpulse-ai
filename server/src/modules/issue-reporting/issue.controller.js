const IssueService = require('./issue.service');
const IssueQueryService = require('./issue.query.service');
const { sendSuccess, sendError } = require('../../utils/response');

/**
 * Controller handling all civic issue HTTP endpoints.
 */
class IssueController {
  /**
   * POST /api/issues
   * Creates a new civic issue report.
   */
  static async createIssue(req, res, next) {
    try {
      const userId = req.user.id;
      const issueData = req.validatedIssue;

      const result = await IssueService.createIssue(userId, issueData);

      return sendSuccess(
        res,
        'Issue reported successfully.',
        {
          issue_id: result.issue_id,
          status: result.status,
        },
        201
      );
    } catch (err) {
      // Handle foreign key error if user_id does not exist in users table
      if (err.code === '23503') {
        return sendError(
          res,
          `Referenced entity does not exist: ${err.detail || err.message}`,
          'ERR_NOT_FOUND',
          404
        );
      }
      next(err);
    }
  }

  /**
   * GET /api/issues/my
   * Lists all issues filed by the currently authenticated user.
   * Supports pagination via ?page=1&limit=10 query params.
   */
  static async getMyIssues(req, res, next) {
    try {
      const userId = req.user.id;

      const page = Math.max(1, parseInt(req.query.page, 10) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));

      const result = await IssueQueryService.getIssuesByUser(userId, page, limit);

      return sendSuccess(res, 'Issues retrieved successfully.', {
        issues: result.issues,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          total_pages: Math.ceil(result.total / result.limit),
        },
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/issues/:id
   * Fetches a single issue by its human-readable ID.
   * Any authenticated user can view a full issue record.
   */
  static async getIssueById(req, res, next) {
    try {
      const { id } = req.params;
      const issue = await IssueQueryService.getIssueById(id);

      if (!issue) {
        return sendError(
          res,
          `Issue with ID "${id}" was not found.`,
          'ERR_NOT_FOUND',
          404
        );
      }

      return sendSuccess(res, 'Issue retrieved successfully.', issue);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/issues/:id/status
   * Retrieves current status and full status history for tracking.
   */
  static async getIssueStatus(req, res, next) {
    try {
      const { id } = req.params;
      const result = await IssueQueryService.getIssueStatus(id);

      if (!result) {
        return sendError(
          res,
          `Issue with ID "${id}" was not found.`,
          'ERR_NOT_FOUND',
          404
        );
      }

      return sendSuccess(res, 'Issue status retrieved successfully.', result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = IssueController;
