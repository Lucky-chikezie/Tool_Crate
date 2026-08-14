const express = require('express');
const protect = require('../middleware/auth');
const {
  submitTool,
  upvoteTool,
  getRecentTools,
  getPopularTools,
  getRelatedTools,
} = require('../controllers/toolController');

const router = express.Router();

// Static paths declared before "/:id/..." so "recent"/"popular"
// don't get swallowed as an :id param.
router.get('/recent', getRecentTools);
router.get('/popular', getPopularTools);
router.get('/:id/related', getRelatedTools);

router.post('/', protect, submitTool);
router.post('/:id/upvote', protect, upvoteTool);

module.exports = router;