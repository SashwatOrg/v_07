const cors = require("cors");
const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const md5 = require("md5");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");
const app = express();
const corsOptions = {
  origin: 'http://localhost:5173', // Specify the frontend URL here
  methods: ['GET', 'POST', "PUT", "DELETE"],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
// This will allow inline scripts and styles by setting 'unsafe-inline' (not recommended for production)
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data:"
  );
  next();
});
app.use('/html_reports', express.static(path.join(__dirname, 'public', 'html_reports')));

app.use(cors(corsOptions));
const port = 3000;
const xlsx = require("xlsx");
const db = require("./db/dbConnection");
const multer = require("multer");
const sendOtp=require("./utils/sendOtp.js");
const pdfRoutes = require('./pdfGenModule/routes/allPdfAndHtmlRoutes.js')
app.options("*", cors()); // Allow all OPTIONS requests for CORS preflight

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", "./pdfGenModule/views");

// Add this before your route definitions
app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.path}`);
  next();
});

// Add error handling middleware at the end of your route configurations
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    message: 'An unexpected error occurred',
    error: err.message
  });
});
app.use("/pdf", pdfRoutes);
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from your frontend
  methods: ['GET', 'POST'], // Specify allowed methods
  credentials: true, // Allow credentials (if needed)
}));
app.use(cookieParser());


// Serve the 'pdfs' directory statically
app.use('/pdfs', express.static(path.join(__dirname, 'public', 'pdfs')));


const secretKey = "your_secret_key";

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(403).send("A token is required for authentication");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};
const updateRoutes = require("./routes/updateRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const programRoutes = require("./routes/programRoutes");
const createInstituteRoutes = require("./routes/createInstituteRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const getDeptRoutes = require("./routes/getDeptRoutes");
const getInstituteRoutes = require("./routes/getInstituteRoutes");
const registerInstAdminRoutes = require("./routes/registerInstAdminRoutes");
const setInstituteRoutes = require("./routes/setInstituteRoutes");
const authRoutes = require("./routes/authRoutes");
const registerFacultyRoutes = require("./routes/registerFacultyRoutes.js");
const eventRoutes = require("./routes/eventRoutes.js");
const getDepartmentNames = require("./routes/getDeptNameRoutes.js");
const getAcadDepartmentNames = require("./routes/getAcadDeptRoutes.js");
const submitFacultyFeedbacks = require("./routes/submitFacultyFeedbackRoutes.js");
const studentRoutes = require("./routes/studentRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const addResearchData = require("./routes/researchRoutes");
const addOpportunity = require("./routes/careerOpportunities");
const addInfrastructure = require("./routes/infraRoutes");
const financeRoutes = require("./routes/financeRoutes");
const postFinanceRoutes = require("./routes/postFinanceRoutes");
const placementRoutes = require("./routes/PlacementRoutes.js");
const placementSingleRoutes = require('./routes/placementSingleRoutes'); 
const visualRoutes = require('./routes/visualRoutes.js')
const clubRoutes = require("./routes/clubRoutes");
const achievementRoutes = require("./routes/achievementRoutes");
const getClubNames = require("./routes/getClubNameRoutes")
const courseRoutes = require("./routes/CreatecourseRoutes.js");
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');
const eventRouter = require("./routes/CreateBulkEventRoutes.js");
const bulkProgramRouter = require("./routes/bulkProgramRouter.js");
const bulkCreateCourseRoute = require("./routes/BulkCreateCourseRoute.js");
const getFacultyEmailRoutes = require("./routes/getFacEmailRoutes");
const putDeptChangesRoutes = require("./routes/putDeptRoutes");
const deleteDeptRoutes = require("./routes/deleteDeptRoutes");
const getProgRoutes = require("./routes/getProgRoutes");
const putProgChangesRoutes = require("./routes/putProgRoutes");
const deleteProgramRoutes = require("./routes/deleteProgRoutes");
const getEvents = require("./routes/getEventRoutes");
const putEventChangesRoutes = require("./routes/putEventRoutes");
const deleteEventRoutes = require("./routes/deleteEventRoutes");
const getInstituteClubNamesRoutes = require('./routes/getInstituteClubNamesRoutes.js')

app.use("/api", uploadRoutes);
app.use("/api", updateRoutes);
app.use("/api", programRoutes);
app.use("/api", createInstituteRoutes);
app.use("/api", departmentRoutes);
app.use("/api", getDeptRoutes);
app.use("/api", getInstituteRoutes);
app.use("/api", registerInstAdminRoutes);
app.use("/api", setInstituteRoutes);
app.use("/api", authRoutes);
app.use("/api", registerFacultyRoutes);
app.use("/api", eventRoutes);
app.use("/api", getDepartmentNames);
app.use("/api", getAcadDepartmentNames);
app.use("/api", submitFacultyFeedbacks);
app.use("/api", studentRoutes);
app.use("/api", enrollmentRoutes);
app.use("/api", addResearchData);
app.use("/api", addOpportunity);
app.use("/api", addInfrastructure);
app.use("/api", financeRoutes);
app.use("/api", postFinanceRoutes);
app.use("/api/placements", placementRoutes);  
app.use("/api", placementSingleRoutes);
app.use("/api",visualRoutes)
app.use("/api", clubRoutes);
app.use("/api", achievementRoutes);
app.use("/api", getClubNames);
app.use("/api/course", courseRoutes);
app.use("/api/events", eventRouter);
app.use("/api/bulk-program", bulkProgramRouter);
app.use("/api/course", bulkCreateCourseRoute);
app.use("/api", getFacultyEmailRoutes);
app.use("/api", putDeptChangesRoutes);
app.use("/api", deleteDeptRoutes);
app.use("/api", getProgRoutes);
app.use("/api", putProgChangesRoutes);
app.use("/api", deleteProgramRoutes);
app.use("/api", getEvents);
app.use("/api", putEventChangesRoutes);
app.use("/api", deleteEventRoutes)
app.use("/api",getInstituteClubNamesRoutes);


//HK add Courses



//verify OTP
app.post("/verify", (req, res) => {
  const {otp,emailId} = req.body; // Retrieve OTP and user_id from request body

  console.log("otp",otp);
  // user_id=sessionStorage.getItem("user_id");
  if (!otp ) {
    return res.status(400).send("OTP are required");
  }

  // console.log("email",email);
  db.query(
    "SELECT * FROM user WHERE  email_id = ? AND otp = ?",
    [emailId, otp],
    (err, results) => {
      if (err) {
        console.error("Error verifying OTP:", err);
        return res.status(500).send("Internal Server Error");
      }

      if (results.length === 0) {
        return res.status(400).send("Invalid OTP");
      }

      // If OTP is valid, update the user's verification status
      db.query(
        "UPDATE User SET isVerified = 1, otp = NULL WHERE email_id = ?",
        [emailId],
        (err) => {
          if (err) {
            console.error("Error updating user verification:", err);
            return res.status(500).send("Verification failed");
          }

          // Send a success response
          return res.status(200).send("User verified successfully");
        }
      );
    }
  );
});

// Fetch Programs
app.post("/programs", (req, res) => {
  const { user_id } = req.body;
  console.log("Received User ID:", user_id); // Log user_id here to verify
  console.log("Userid Is: ", user_id);
  if (!user_id) {
    return res.status(400).send("User ID is required");
  }

  const query = `
    SELECT prog.prog_id, prog.prog_name
    FROM program AS prog
    WHERE prog.dept_id = (
      SELECT dept.dept_id
      FROM department AS dept
      WHERE dept.coordinator_id = ?
    )
  `;

  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error("Error fetching programs:", err);
      return res.status(500).send("Error fetching programs");
    }

    if (results.length === 0) {
      console.log("No programs found for user ID:", user_id); // Log no results
      return res.status(404).send("No programs found for the given user ID");
    }
    console.log("Fetched Programs:", results);
    res.json(results);
  });
});

// Add Course
app.post("/api/add", (req, res) => {
  const { course_name, program_id, semester } = req.body;

  // Validate input
  if (!course_name || !program_id || !semester) {
    return res.status(400).send("All fields are required");
  }

  const query = `
    INSERT INTO courses (course_name, program_id, semester)
    VALUES (?, ?, ?)
  `;

  db.query(query, [course_name, program_id, semester], (err, result) => {
    if (err) {
      console.error("Error adding course:", err);
      return res.status(500).send("Error adding course");
    }

    res.status(201).send("Course added successfully");
  });
});

// API endpoint to get department by user_id
app.get("/get-department/:user_id", (req, res) => {
  const { user_id } = req.params; // Accessing the user_id from the route parameters
  console.log("The coordinator ID is:", user_id);

  db.query(
    "SELECT dept_name FROM department WHERE coordinator_id = ?",
    [user_id],
    (error, results) => {
      if (error) {
        console.error("Error fetching department:", error);
        return res
          .status(500)
          .json({ message: "An error occurred while fetching the department" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Department not found" });
      }

      const department = results[0];
      res.status(200).json({ dept_name: department.dept_name });
    }
  );
});

//HK add Courses
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});

app.post("/register/institute-admin", (req, res) => {
  const {
    username,
    first_name,
    last_name,
    email,
    mobile_number,
    gender,
    password,
    usertype,
  } = req.body;

  // console.log(mobile_number);
  if (
    !username ||
    !first_name ||
    !last_name ||
    !email ||
    !mobile_number ||
    !gender ||
    !password ||
    !usertype
  ) {
    res
      .status(400)
      .send(
        "Username, name, email, mobile number, password, gender & usertype all are required!"
      );
    return;
  }

  const hashedPassword = md5(password);

  const query =
    "INSERT INTO User ( first_name, last_name, email_id, username, mobile_number, password, gender, type_id, institute_id, is_active, created_at, updated_at) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, NULL, NULL)";
  db.query(
    query,
    [
      first_name,
      last_name,
      email,
      username,
      mobile_number,
      hashedPassword,
      gender,
      usertype,
      1,
    ],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
        return;
      }
      res
        .status(201)
        .json({ id: results.insertId, first_name, last_name, email });
    }
  );
});

// updated
app.post("/loginMe", (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = md5(password);

  const query = `
    SELECT user.*, roles.role_name, institute.institute_name
    FROM user
    JOIN roles ON user.type_id = roles.role_id
    JOIN institute ON user.institute_id = institute.institute_id
    WHERE user.username = ? AND user.password = ?
  `;

  db.query(query, [username, hashedPassword], (err, results) => {
    if (err) {
      console.log("i am here viraj");
      res.status(500).json({ message: "Internal server error" });
      return;
    }

    if (results.length === 0) {
      res.status(401).json({ message: "Invalid username or password" });
      return;
    }

    const user = results[0];
    console.log("the user befiore decoding ", user);
    const token = jwt.sign(
      {
        id: user.user_id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        type_id: user.type_id,
        role_name: user.role_name,
        email_id: user.email_id,
        mobile_number: user.mobile_number,
        gender: user.gender,
        is_active: user.is_active,
        institute_id: user.institute_id,
        institute_name: user.institute_name, // Include institute_name in the token
      },
      secretKey,
      { expiresIn: "12h" }
    );
    res.status(200).json({ token });
  });
});
app.post("/create-institute", (req, res) => {
  const {
    username,
    institute,
    addressl1,
    subdist,
    district,
    state,
    country,
    enrollmentKey,
  } = req.body;
  console.log(
    username,
    institute,
    addressl1,
    subdist,
    district,
    state,
    country,
    enrollmentKey
  );
  // console.log('State: ',state);

  // Validate required fields
  if (
    !username ||
    !institute ||
    !subdist ||
    !district ||
    !state ||
    !country ||
    !enrollmentKey
  ) {
    return res
      .status(400)
      .send(
        "Institute name, address lines, subdistrict, district, state, country and enrollmentKey are required!"
      );
  }

  // Step 1: Insert the institute into the Institute table
  const queryInsertInstitute =
    "INSERT INTO Institute (Enrollment_key, institute_name ,address_lines, subdistrict, district, state, country) VALUES ( ?, ? ,?, ?, ?, ?, ?)";

  db.query(
    queryInsertInstitute,
    [enrollmentKey, institute, addressl1, subdist, district, state, country],
    (err, results) => {
      if (err) {
        // console.log('error is ',err)
        return res.status(500).send(err);
      }
      console.log(results);
      const instituteId = results.insertId;
      console.log(instituteId);
      // Step 2: Find the user by username and update their institute_id
      const queryFindUser = "SELECT user_id FROM User WHERE username = ?";

      db.query(queryFindUser, [username], (err, userResults) => {
        if (err) {
          return res.status(500).send(err);
        }

        if (userResults.length === 0) {
          return res.status(404).send("User  not found!");
        }

        const userId = userResults[0].user_id;

        // Step 3: Update the User table to set the institute_id
        const queryUpdateUser =
          "UPDATE User SET institute_id = ? WHERE user_id = ?";

        db.query(
          queryUpdateUser,
          [instituteId, userId],
          (err, updateResults) => {
            if (err) {
              return res.status(500).send(err);
            }

            // Respond with the created institute information and user ID
            res.status(201).json({
              id: instituteId,
              institute,
              addressl1,
              subdist,
              district,
              state,
              country,
              user_id: userId,
            });
          }
        );
      });
    }
  );
});

// create faculty
// app.post("/register/institute-faculty", async (req, res) => {
//   const {
//     first_name,
//     last_name,
//     email,
//     username,
//     mobile_number,
//     gender,
//     password,
//     institute,
//     faculty_reg_id,
//     department,
//     usertype
//   } = req.body;
//   console.log("usertype is ", usertype);
//   // Check if all required fields are provided
//   if (
//     !first_name ||
//     !last_name ||
//     !email ||
//     !username ||
//     !mobile_number ||
//     !gender ||
//     !password ||
//     !institute ||
//     !faculty_reg_id
//   ) {
//     return res.status(400).send("All fields are required!");
//   }
//   console.log("faculty reg is ", faculty_reg_id);

//   try {
//     // Hash the password (use bcrypt for security, not md5)
//     const hashedPassword = md5(password); // Replace with bcrypt for more security

//     // Query to get the institute_id using institute name
//     const [instituteResult] = await db
//       .promise()
//       .query("SELECT institute_id FROM institute WHERE institute_name = ?", [
//         institute,
//       ]);

//     if (instituteResult.length === 0) {
//       return res.status(404).send("Institute not found!");
//     }
//     const instituteId = instituteResult[0].institute_id;

//     // Query to insert the faculty user into the User table
//     await db.promise().query(
//       `INSERT INTO User (first_name, last_name, email_id, username, mobile_number, password, gender, type_id, institute_id, is_active, created_at)
//          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, true, NOW())`,
//       [
//         first_name,
//         last_name,
//         email,
//         username,
//         mobile_number,
//         hashedPassword,
//         gender,
//         3,
//         instituteId,
//       ]
//     );

//     ////////
//     // find the user_id from the user table  for that email_id
//     const getUserIdQuery = "SELECT user_id FROM user WHERE email_id = ?";
//     db.query(getUserIdQuery, [email], (err, userResults) => {
//       if (err) {
//         console.error("Error fetching user_id:", err);
//         return res.status(500).send("Internal Server Error");
//       }

//       if (userResults.length === 0) {
//         return res.status(404).send("User  not found");
//       }

//       const userId = userResults[0].user_id; // Get user_id
//       console.log(userId);
//       // Step 2: Find dept_id from department table
//       // find the depart_id from the depart nemae comin gfro tfrontend
//       const getDeptIdQuery =
//         "SELECT dept_id FROM department WHERE dept_name = ?";
//       db.query(getDeptIdQuery, [department], (err, deptResults) => {
//         if (err) {
//           console.error("Error fetching dept_id:", err);
//           return res.status(500).send("Internal Server Error");
//         }

//         if (deptResults.length === 0) {
//           return res.status(404).send("Department not found");
//         }

//         const deptId = deptResults[0].dept_id; // Get dept_id
//         console.log(deptId);
//         // Step 3: Insert into faculty table
//         const insertFacultyQuery =
//           "INSERT INTO faculty (User_id, reg_no, Dept_id) VALUES (?, ?, ?)";
//         db.query(
//           insertFacultyQuery,
//           [userId, faculty_reg_id, deptId],
//           (err, insertResults) => {
//             if (err) {
//               console.error("Error inserting faculty:", err);
//               return res.status(500).send("Internal Server Error");
//             }

//             // Successfully inserted
//             res.status(201).send("Faculty registered successfully");
//           }
//         );
//       });
//     });
//     // now inserting into faculty table
//     // User_id  ,Faculty_Reg_Number ,Dept_id
//     /////////
//     res
//       .status(201)
//       .json({ message: "Institute faculty registered successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error registering institute faculty: " + err.message);
//   }
// });

// Endpoint to get all institutes
app.get("/institutes", (req, res) => {
  const query = "SELECT institute_name, Enrollment_key FROM Institute";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching institutes:", err);
      return res.status(500).send("Internal Server Error");
    }

    // Send the results as JSON
    res.json(results); // The results will be an array of objects with institute_name and Enrollment_key
  });
});
// get department names based on instiute name
app.get("/departments", (req, res) => {
  const instituteName = req.query.institute; // Get the institute name from query parameters

  // First, get the institute_id based on the institute_name
  const instituteQuery =
    "SELECT institute_id FROM Institute WHERE institute_name = ?";

  db.query(instituteQuery, [instituteName], (err, instituteResults) => {
    if (err) {
      console.error("Error fetching institute:", err);
      return res.status(500).send("Internal Server Error");
    }

    if (instituteResults.length === 0) {
      return res.status(404).send("Institute not found");
    }

    const instituteId = instituteResults[0].institute_id; // Get the institute_id

    // Now, fetch the departments for this institute_id
    const departmentQuery =
      "SELECT  dept_name FROM Department WHERE institute_id = ?";

    db.query(departmentQuery, [instituteId], (err, departmentResults) => {
      if (err) {
        console.error("Error fetching departments:", err);
        return res.status(500).send("Internal Server Error");
      }

      // Send the results as JSON
      res.json(departmentResults); // The results will be an array of objects with dept_id and dept_name
    });
  });
});

// // // get programs names based on department name
// // // Assuming you have already set up your Express app and database connection

// // // Endpoint to fetch programs based on department name
app.get("/programs", (req, res) => {
  const { department } = req.query; // Get department name from query parameters
  console.log("Deparrtment nme is", department);
  // Step 1: Find the dept_id based on the department name
  const getDeptIdQuery = "SELECT dept_id FROM department WHERE dept_name = ?";

  db.query(getDeptIdQuery, [department], (err, deptResults) => {
    if (err) {
      console.error("Error fetching dept_id:", err);
      return res.status(500).send("Internal Server Error");
    }

    // Check if the department exists
    if (deptResults.length === 0) {
      return res.status(404).send("Department not found");
    }

    const deptId = deptResults[0].dept_id; // Get dept_id
    console.log("the deptId is", deptId);
    // Step 2: Fetch program names based on the dept_id
    const getProgramsQuery = "SELECT prog_name FROM program WHERE dept_id = ?";

    db.query(getProgramsQuery, [deptId], (err, programResults) => {
      if (err) {
        console.error("Error fetching programs:", err);
        return res.status(500).send("Internal Server Error");
      }

      // Send the results as JSON
      res.json(programResults);
      console.log(programResults); // The results will be an array of program objects
    });
  });
});

app.post("/register/institute-student", async (req, res) => {
  // Destructure values from req.body

  const {
    username,
    first_name,
    last_name,
    email,
    mobile_number,
    gender,
    password,
    institute,
    usertype,
    department,
    program,
    current_semester,
    student_reg_id,
  } = req.body;

  // Log each value with a descriptive label
  console.log("Username:", username);
  console.log("First Name:", first_name);
  console.log("Last Name:", last_name);
  console.log("Email:", email);
  console.log("Mobile Number:", mobile_number);
  console.log("Gender:", gender);
  console.log("Password:", password); // Be careful with logging sensitive data
  console.log("Institute:", institute);
  console.log("Department:", department);
  console.log("Program:", program);
  console.log("Current Semester:", current_semester);
  console.log("stud_reg:", student_reg_id);
  try {
    // Step 1: Get the institute_id based on the institute name
    const [instituteRows] = await db
      .promise()
      .query("SELECT institute_id FROM institute WHERE institute_name = ?", [
        institute,
      ]);

    if (instituteRows.length === 0) {
      return res.status(404).json({ message: "Institute not found" });
    }

    // Hash the password (use bcrypt for security, not md5)
    const hashedPassword = md5(password); // Replace with bcrypt for more security
    const institute_id = instituteRows[0].institute_id;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Step 2: Insert the user into the user table
    const [userRows] = await db
      .promise()
      .query(
        "INSERT INTO user (username, first_name, last_name, email_id, mobile_number, password, gender, type_id, institute_id, is_active,otp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)",
        [
          username,
          first_name,
          last_name,
          email,
          mobile_number,
          hashedPassword, // Make sure to hash this password before saving it
          gender,
          usertype, // Assuming usertype is the type_id
          institute_id,
          1,
          otp, // is_active set to 1
        ]
      );
      sendOtp(email,otp)
    // Step 3: Get the user_id of the newly created user
    const user_id = userRows.insertId; // This will give you the ID of the newly inserted user

    // Step 4: Get the program_id based on the program name
    const [programRows] = await db
      .promise()
      .query("SELECT prog_id FROM program WHERE prog_name = ?", [program]);

    if (programRows.length === 0) {
      return res.status(404).json({ message: "Program not found" });
    }

    const program_id = programRows[0].prog_id;

    // Step 5: Insert the student into the student table
    await db
      .promise()
      .query(
        "INSERT INTO student (user_id, program_id, current_semester,stud_reg) VALUES (?, ?, ?,?)",
        [user_id, program_id, current_semester, student_reg_id]
      );

      return res.status(200).send("OTP sent successfully");

    // Step 6: Respond with success
    // res.status(201).json({
    //   message: "User  registered and student record created successfully",
    //   user_id,
    // });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// // endpoint to get the al course for that faculty
app.get("/courses", (req, res) => {
  const { userId } = req.query; // Extracting the `userId` from the query parameters
  //console.log("The user ID is:", userId);

  // First, query to get the Faculty_id using the provided user_id
  const getFacultyIdQuery = `
    SELECT Faculty_id 
    FROM faculty 
    WHERE User_id = ?;
  `;

  // Database connection (replace `db` with your actual database connection instance)
  db.query(getFacultyIdQuery, [userId], (error, results) => {
    if (error) {
      console.log("Database error while fetching Faculty_id:", error);
      return res
        .status(500)
        .json({ error: "Database error while fetching Faculty_id" });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ error: "No Faculty_id found for the provided user_id" });
    }

    const facultyId = results[0].Faculty_id;
    //console.log("The faculty ID is:", facultyId);

    // Now, query to get the courses using the Faculty_id
    const getCoursesQuery = `
      SELECT c.course_name,c.course_id
      FROM course c
      JOIN program p ON c.program_id = p.prog_id
      JOIN department d ON p.Depart_id = d.Dept_id
      JOIN faculty f ON d.Dept_id = f.Dept_id
      WHERE f.Faculty_id = ?;
    `;

    db.query(getCoursesQuery, [facultyId], (err, courses) => {
      if (err) {
        console.log("Database error while fetching courses:", err);
        return res
          .status(500)
          .json({ error: "Database error while fetching courses" });
      }

      // Log the courses to see what you got
      //console.log("The courses are:", courses);

      // If there are no courses, return an empty array
      if (courses.length === 0) {
        return res.json({ courses: [] });
      }

      // Send the courses in the response
      res.json({ courses });
    });
  });
});


app.post('/generate-html', async (req, res) => {
  const { options, year, user } = req.body;

  // Fetch the financial data based on the provided options and year
  const financialData = await getFinancialData(options, year); // Your logic to get financial data

  // Define the path where the HTML report will be saved
  const reportDirectory = path.join(__dirname, 'public', 'html_reports');
  const reportFilePath = path.join(reportDirectory, `financial_report_${year}.html`);

  // Create the directory if it doesn't exist
  if (!fs.existsSync(reportDirectory)) {
      fs.mkdirSync(reportDirectory, { recursive: true });
  }

  // Generate the HTML content
  const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Financial Report for Year: ${year}</title>
      </head>
      <body>
          <h1>Financial Report for Year: ${year}</h1>
          <table>
              <thead>
                  <tr>
                      <th>Description</th>
                      <th>Amount</th>
                  </tr>
              </thead>
              <tbody>
                  ${financialData.length > 0 ? financialData.map(data => `
                      <tr>
                          <td>${data.description || data.event_name || data.club_name || data.dept_name}</td>
                          <td>${data.amount || data.event_budget || data.total_budget}</td>
                      </tr>
                  `).join('') : `
                      <tr>
                          <td colspan="2">No data available for the selected options.</td>
                      </tr>
                  `}
              </tbody>
          </table>
      </body>
      </html>
  `;

  // Write the HTML content to the file
  fs.writeFile(reportFilePath, htmlContent, (err) => {
      if (err) {
          console.error('Error writing HTML file:', err);
          return res.status(500).json({ message: 'Error generating HTML report' });
      }
      // Send the path of the generated HTML file
      res.status(200).json({ filePath: `/html_reports/financial_report_${year}.html` });
  });
});




app.get("/api/user-photo/:userid", (req, res) => {
  const { userid } = req.params;
  // Step 1: Define the query to fetch the photo URL
  const queryFetchPhoto = "SELECT url FROM photourl WHERE user_id = ?";


  // Execute the query
  db.query(queryFetchPhoto, [userid], (err, results) => {
    if (err) {
      console.error("Error fetching photo:", err);
      return res.status(500).send("Error fetching photo.");
    }


    // Check if the query returned any results
    if (results.length === 0) {


      return res.status(404).send("Photo not found.");
    }


    // Extract the photo URL
    const photoURL = results[0].url;




    // Return the photo URL as JSON response
    res.status(200).json({ photoURL });
  });
});




app.use('/api', userRoutes);
// app.use('/api',updatepassRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Use the profile routes
app.use('/api', profileRoutes);

