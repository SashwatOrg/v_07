const express = require('express');
const router = express.Router();
const { getDepartmentWiseStudentCount, getDepartmentWiseFacultyCount, getTypeWiseClubCount } = require('../controllers/visualController');

// Route to create a program
router.get('/get-deptwise-student-count/:institute_id', getDepartmentWiseStudentCount);
router.get('/get-deptwise-faculty-count/:institute_id', getDepartmentWiseFacultyCount);
router.get('/get-typewise-club-count/:institute_id', getTypeWiseClubCount);


module.exports = router;