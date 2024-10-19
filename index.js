const express = require("express");
const cors = require("cors"); // Import cors
const app = express();
const port = 5000;
const { pool } = require("./dbConfig");
require("dotenv").config();

app.use(cors()); // Enable CORS for all origins
app.use(express.json());

// Import Routes
const admin = require("./routes/Admins/AdminAuth");
const accounts = require("./routes/Accounts/accounts");
const screens = require("./routes/Screens/screens");
const Leads = require("./routes/Leads/leads");

// Files for each endpoint
app.use("/admin", admin);
app.use("/accounts", accounts);
app.use("/screens", screens);
app.use("/ads", Leads);

app.get("/", (req, res) => {
  res.send("This is the backend for the ManageFlix Application!");
});

app.listen(port, () => {
  console.log(`
        ======================
        ======================
        +++ Server Running +++
        ======================
        ======================

        ======================
        ======================
        +++++ Port: ${port} +++++
        ======================
        ======================  
    `);
});

async function checkDbConnection() {
  try {
    const result = await pool.query("select now()");
    if (result) {
      console.log(`
        **********************
        **********************
        ---- DB Connected ----
        **********************
        **********************
        `);
    }
  } catch (error) {
    console.log(`
          ##################
          ##################
          ***** Failed *****
          ##################
          ##################
        `);
    console.log(`Error Message: ${error.message}`);
  }
}

checkDbConnection();
