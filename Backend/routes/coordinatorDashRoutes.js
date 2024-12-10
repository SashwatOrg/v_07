const express = require('express');
const { countStudents, countFaculty, countPrograms, countDepartments, countClubs, countEvents } = require('../controllers/instAdminDashController');

const router = express.Router();

router.get('/coordinator/count-students/:username', countStudents);
router.get('/coordinator/count-faculty/:username', countFaculty);
router.get('/coordinator/count-departments/:username', countDepartments);
router.get('/coordinator/count-programs/:username', countPrograms);
router.get('/coordinator/count-clubs/:username', countClubs);
router.get('/coordinator/count-events/:username', countEvents);

module.exports = router;