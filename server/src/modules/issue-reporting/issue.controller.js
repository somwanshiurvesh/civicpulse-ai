const IssueService = require('./issue.service');
const { sendSuccess, sendError } = require('../../utils/response');

/**
 * Controller handling civic issue HTTP endpoints.
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
      // Handle foreign key error if user_id does not exist
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
}

module.exports = IssueController;
