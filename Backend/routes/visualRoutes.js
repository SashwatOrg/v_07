const express = require('express');
const router = express.Router();
const { getDepartmentWiseStudentCount } = require('../controllers/visualController');


// Route to create a program
router.get('/get-deptwise-student-count/:institute_id', getDepartmentWiseStudentCount);


module.exports = router;


