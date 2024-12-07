const db = require('../db/dbConnection');

// Controller function to get all departments with student counts greater than 0
const getDepartmentWiseStudentCount = async (req, res) => {
  const { institute_id } = req.params;

  // SQL query to get department names and student counts
  const sql = `
    SELECT d.dept_name, COUNT(s.student_id) AS student_count
    FROM department d
    LEFT JOIN program p ON d.dept_id = p.dept_id
    LEFT JOIN student s ON s.program_id = p.prog_id
    WHERE d.institute_id = ?
    GROUP BY d.dept_name
    HAVING student_count > 0
  `;

  try {
    // Log the query and parameters for debugging
    console.log("Executing SQL:", sql, "with institute_id:", institute_id);

    const departments = await new Promise((resolve, reject) => {
      db.query(sql, [institute_id], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    // Log the results for debugging
    console.log("Departments with student counts greater than 0:", departments);

    // Send the results as a JSON response
    res.status(200).json(departments);
  } catch (error) {
    console.error("Error fetching department-wise student counts:", error);
    res.status(500).json({ error: error.message });
  }
};

const getDepartmentWiseFacultyCount = async (req, res) => {
  const { institute_id } = req.params;

  // SQL query to get department names and student counts
  const sql = `
    SELECT d.dept_name, COUNT(f.faculty_id) AS faculty_count
    FROM department d
    LEFT JOIN faculty f ON f.dept_id = d.dept_id
    WHERE d.institute_id = ?
    GROUP BY d.dept_name
    HAVING faculty_count > 0
  `;

  try {
    // Log the query and parameters for debugging
    console.log("Executing SQL:", sql, "with institute_id:", institute_id);

    const departments = await new Promise((resolve, reject) => {
      db.query(sql, [institute_id], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    // Log the results for debugging
    console.log("Departments with faculty counts greater than 0:", departments);

    // Send the results as a JSON response
    res.status(200).json(departments);
  } catch (error) {
    console.error("Error fetching department-wise faculty counts:", error);
    res.status(500).json({ error: error.message });
  }
};

const getTypeWiseClubCount = async (req, res) => {
  const { institute_id } = req.params;

  // SQL query to get department names and student counts
  const sql = `
    SELECT club_type, COUNT(club_id) AS club_count
    FROM club
    WHERE institute_id = ?
    GROUP BY club_type`;

  try {
    // Log the query and parameters for debugging
    console.log("Executing SQL:", sql, "with institute_id:", institute_id);

    const clubs = await new Promise((resolve, reject) => {
      db.query(sql, [institute_id], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    // Send the results as a JSON response
    res.status(200).json(clubs);
  } catch (error) {
    console.error("Error fetching type-wise club counts:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getDepartmentWiseStudentCount, getDepartmentWiseFacultyCount, getTypeWiseClubCount };