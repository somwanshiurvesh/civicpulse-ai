const { Router } = require('express');
const IssueController = require('./issue.controller');
const { validateIssueCreation } = require('./issue.validator');
const { authenticateToken } = require('../../middleware/auth');

const router = Router();

// POST /api/issues — Create a new civic issue report
router.post('/', authenticateToken, validateIssueCreation, IssueController.createIssue);

// GET /api/issues/my — List authenticated user's own issues (must be before /:id)
router.get('/my', authenticateToken, IssueController.getMyIssues);

// GET /api/issues/:id — Fetch a single issue by ID
router.get('/:id', authenticateToken, IssueController.getIssueById);

// GET /api/issues/:id/status — Fetch status history for an issue
router.get('/:id/status', authenticateToken, IssueController.getIssueStatus);

module.exports = router;
