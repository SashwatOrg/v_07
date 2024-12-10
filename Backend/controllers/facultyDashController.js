const db = require('../db/dbConnection');

const countResearchPapers = (req, res) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).send("Username parameter is required.");
  }

  const userQuery = `
    SELECT COUNT(researcher_id) AS researchCount
    FROM researcher
    WHERE username = ?`;

  db.query(userQuery, [username], (err, rows) => {
    if (err) {
      console.error('Error counting research papers:', err);
      return res.status(500).send('Error retrieving information.', err);
    }

    if (!rows || rows.length === 0 || rows[0].researchCount === null) {
      return res.status(404).send("No research papers found for the given user.");
    }

    const count = rows[0].researchCount;
    res.status(200).json({ count });
  });
};

module.exports = { countResearchPapers };
