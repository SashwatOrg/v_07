// const bcrypt = require("bcrypt");
// const db = require("../db/dbConnection"); // Adjust path as needed
// const md5 = require("md5");
// /**
//  * Update password for a user by user_id
//  */
// const updatePassword = async (req, res) => {
//   const { user_id, newPassword ,currentPassword} = req.body;
//   console.log("user id is ", user_id);
//   // Validate input
//   if (!user_id || !newPassword) {
//     return res.status(400).json({ message: "User ID and new password are required." });
//   }

//   try {
//     // Hash the new password
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     const old=md5(currentPassword);
//     // Update password in the database
//     const query = `UPDATE user SET password = ? WHERE user_id = ?`;
//     const values = [hashedPassword, user_id];

//     const [result] = await db.execute(query, values);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: "Uvbvnbm" });
//     }

//     res.status(200).json({ message: "Password updated successfully." });
//   } catch (error) {
//     console.error("Error updating password:", error);
//     res.status(500).json({ message: "Internal server error." });
//   }
// };

// module.exports = { updatePassword };

const bcrypt = require("bcrypt");
const db = require("../db/dbConnection"); // Adjust path as needed

/**
 * Update password for a user by user_id
 */
const updatePassword = async (req, res) => {
  const { user_id, newPassword, currentPassword } = req.body;

  // Validate input
  if (!user_id || !newPassword || !currentPassword) {
    return res.status(400).json({ message: "User ID, current password, and new password are required." });
  }

  try {
    // Fetch the user's current password hash from the database
    const queryFetch = `SELECT password FROM user WHERE user_id = ?`;
    const [rows] = await db.execute(queryFetch, [user_id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const storedPasswordHash = rows[0].password;

    // Compare the provided current password with the stored password hash
    const isMatch = await bcrypt.compare(currentPassword, storedPasswordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in the database
    const queryUpdate = `UPDATE user SET password = ? WHERE user_id = ?`;
    const values = [hashedPassword, user_id];
    const [result] = await db.execute(queryUpdate, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Password update failed." });
    }

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { updatePassword };
