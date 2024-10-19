const express = require("express");
const { pool } = require("../../dbConfig"); // Assuming dbConfig is already set up for PostgreSQL connection
const router = express.Router();

// POST endpoint to submit leads
router.post("/submit-lead", async (req, res) => {
  const { phone_number, screen_quantity } = req.body;

  if (!phone_number || !screen_quantity) {
    return res
      .status(400)
      .json({ message: "Phone number and screen quantity are required" });
  }

  try {
    // Calculate total price
    const screenPrice = 250; // price per screen
    const total_price = screen_quantity * screenPrice;

    // Insert data into the form_submissions table
    const query = `
            INSERT INTO form_submissions (phone_number, screen_quantity, total_price)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
    const values = [phone_number, screen_quantity, total_price];

    const result = await pool.query(query, values);

    res.status(201).json({
      message: "Lead submitted successfully",
      lead: result.rows[0],
    });
  } catch (error) {
    console.error("Error submitting lead:", error);
    res
      .status(500)
      .json({ message: "An error occurred while submitting the lead" });
  }
});

module.exports = router;
