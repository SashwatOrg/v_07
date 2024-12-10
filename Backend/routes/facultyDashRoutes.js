const express = require('express');
const { countResearchPapers } = require('../controllers/facultyDashController');

const router = express.Router();

router.get('/admin/count-research/:username', countResearchPapers);

module.exports = router;