const express = require("express");
const { updatePassword } = require("../controllers/updatepassController");
const bcrypt = require("bcrypt");
const router = express.Router();

// Route for updating password
router.put("/updatepassword", updatePassword);

module.exports = router;
