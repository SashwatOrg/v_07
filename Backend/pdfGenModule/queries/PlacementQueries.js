const db = require("../../db/dbConnection.js"); // Use the existing DB connection

const getPlacementData = async (options, year) => {
    let results = [];
    let params = [year];
    // console.log('hey\n i am in userQueries of placements \n the options selected are ', options);
    // console.log('the selected year is ', year);
    
    for (const option of options) {
        let query;

        switch (option) {
            // Queries for the placements table
            case "1":
                query = `SELECT * FROM placements WHERE year = ?`;
                break;
            case "2":
                query = `SELECT * FROM placements WHERE year = ? AND recruiters IS NOT NULL`;
                break;
            case "3":
                query = `SELECT * FROM placements WHERE year = ? `;
                break;
            case "4":
                query = `SELECT AVG(package_in_lakh) AS average_package FROM placements WHERE year = ?`;
                break;
            case "5":
                query = `SELECT recruiters, COUNT(*) AS total FROM placements WHERE year = ? GROUP BY recruiters ORDER BY total DESC`;
                break;
            case "6":
                query = `SELECT year, COUNT(*) AS total_placements FROM placements GROUP BY year ORDER BY year`;
                break;
            case "7":
                query = `SELECT branch, COUNT(*) AS total FROM placements WHERE year = ? GROUP BY branch`;
                break;
            case "8":
                query = `SELECT student_name, branch, recruiters, package_in_lakh FROM placements WHERE year = ?`;
                break;

            // Queries for the career opportunities table
            case "9":
                query = `SELECT * FROM careeropportunities WHERE year = ?`;
                break;
            case "10":
                query = `SELECT * FROM careeropportunities WHERE year = ? AND organization IS NOT NULL`;
                break;
            case "11":
                query = `SELECT * FROM careeropportunities WHERE year = ? AND position IS NOT NULL`;
                break;
            case "12":
                query = `SELECT AVG(income) AS average_income FROM careeropportunities WHERE year = ?`;
                break;
            case "13":
                query = `SELECT organization, COUNT(*) AS total FROM careeropportunities WHERE year = ? GROUP BY organization ORDER BY total DESC`;
                break;
            case "14":
                query = `SELECT year, COUNT(*) AS total_opportunities FROM careeropportunities GROUP BY year ORDER BY year`;
                break;
            case "15":
                query = `SELECT type, COUNT(*) AS total FROM careeropportunities WHERE year = ? GROUP BY type`;
                break;
            case "16":
                query = `SELECT position, income FROM careeropportunities WHERE year = ?`;
                break;
            default:
                throw new Error("Invalid option selected");
        }

        const [rows] = await db.promise().query(query, params);
        results.push(...rows); // Combine results from all queries
    }

    return results;
};
const getDepartmentByCoordinatorId= async (coordinatorId) => {
    console.log('the cord id isss',coordinatorId)
    const query = `SELECT dept_name FROM department WHERE coordinator_id = ?`;
    const result = await db.promise().query(query, [coordinatorId]);
    console.log("Splendor is ...",result[0])
    return result[0];
  };
const getInstituteName = async (instituteId) => {
    const query = `SELECT institute_name FROM institute WHERE institute_id = ?`;
    const [rows] = await db.promise().query(query, [instituteId]);
    return rows;
};

module.exports = { getPlacementData, getInstituteName,getDepartmentByCoordinatorId };