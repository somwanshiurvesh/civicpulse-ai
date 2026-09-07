const { Router } = require('express');
const IssueController = require('./issue.controller');
const { validateIssueCreation } = require('./issue.validator');
const { authenticateToken } = require('../../middleware/auth');

const router = Router();

// POST /api/issues - Create a new civic issue report
router.post('/', authenticateToken, validateIssueCreation, IssueController.createIssue);

module.exports = router;
