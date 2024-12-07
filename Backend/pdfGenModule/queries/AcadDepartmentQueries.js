const db = require("../../db/dbConnection.js"); // Use the existing DB connection

const getAcademicData = async (options, year) => {
    let results = [];
    let params = [year];

    // Loop through the selected options to build queries
    for (const option of options) {
        let query;

        switch (option) {
            case "1":
                query = `SELECT * FROM student WHERE year = ?`;
                break;
            case "2":
                query = `SELECT * FROM faculty WHERE year = ?`;
                break;
            case "3":
                query = `SELECT * FROM program WHERE year = ?`;
                break;
            case "4":
                query = `SELECT * FROM result WHERE year = ?`;
                break;
            case "5":
                query = `SELECT program.prog_name, COUNT(student.student_id) AS total_students 
                          FROM program 
                          LEFT JOIN student ON program.prog_id = student.program_id 
                          WHERE student.year = ? 
                          GROUP BY program.prog_name`;
                break;
            case "6":
                query = `SELECT faculty.reg_no, faculty.dept_id 
                          FROM faculty 
                          WHERE faculty.year = ?`;
                break;
            case "7":
                query = `SELECT result.grade, COUNT(result.result_id) AS total_results 
                          FROM result 
                          WHERE result.year = ? 
                          GROUP BY result.grade`;
                break;
            default:
                throw new Error("Invalid option selected");
        }

        const [rows] = await db.promise().query(query, params);
        results.push(...rows); // Combine results from all queries
    }

    return results;
};

const getInstituteName = async (instituteId) => {
    const query = `SELECT institute_name FROM institute WHERE institute_id = ?`; // Adjust the query based on your database schema
    const [rows] = await db.promise().query(query, [instituteId]);
    return rows;
};

module.exports = { getAcademicData, getInstituteName };