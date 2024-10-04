const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const { pool } = require("../../dbConfig");

router.post('/signup', async (req, res) => {
  const { email, password, username, name } = req.body;

  if (!username || !password || !email || !name) {
    return res.status(400).json({ error: "Username, name, email, and password are required" });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    console.log(hashedPassword);

    const result = await pool.query(
      'INSERT INTO admins (username, email, password, name) VALUES ($1, $2, $3, $4)',
      [username, email, hashedPassword, name]
    );

    if (result.rowCount >= 1) {
      res.status(201).json({ message: "Admin created successfully" });
    } else {
      res.status(400).json({ error: "Admin creation failed" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login Endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const result = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);

    if (result.rowCount === 0) {
      return res.status(400).json({ error: "No user found with this email" });
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    res.status(200).json({ message: "Login successful", user: { username: user.username, email: user.email } });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
