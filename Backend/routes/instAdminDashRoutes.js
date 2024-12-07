const express = require('express');
const { countStudents, countFaculty, countPrograms, countDepartments } = require('../controllers/instAdminDashController');

const router = express.Router();

router.get('/admin/count-students/:username', countStudents);
router.get('/admin/count-faculty/:username', countFaculty);
router.get('/admin/count-departments/:username', countDepartments);
router.get('/admin/count-programs/:username', countPrograms);

module.exports = router;