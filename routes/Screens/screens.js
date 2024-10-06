const express = require('express');
const router = express.Router();
const { pool } = require('../../dbConfig');

function getUniqueId(length) {
  const characters = '0123456789';
  let uniqueId = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uniqueId += characters[randomIndex];
  }
  return uniqueId;
}

// Endpoint to get screens by account ID
router.get('/:accountId', async (req, res) => {
  const { accountId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM screens WHERE account_id = $1', [accountId]);
    res.status(200).json({ screens: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to add a new screen
router.post('/add-screen', async (req, res) => {
  const {
    screen_status,
    screen_type,
    screen_price,
    admin_id,
    account_id
  } = req.body;

  try {
    // Check if account exists
    const account = await pool.query('SELECT * FROM accounts WHERE id = $1', [account_id]);
    if (account.rows.length === 0) {
      return res.status(400).json({ error: "Account not found" });
    }
    const screen_id = getUniqueId(10)
    const expired = false

    console.log(`Account Id: ${account_id}`);
        
    // Insert new screen into the screens table
    const addNewScreen = await pool.query(
      `INSERT INTO screens 
      (screen_status, screen_type, created_at, updated_at, screen_price, expiry_date, sub_date, 
      expired, user_id, screen_id, account_id) 
      VALUES 
      ($1, $2, NOW(), NOW(), $3, NOW(), NOW(), $4, $5, $6, $7) RETURNING *;
`,
      [screen_status, screen_type, screen_price, expired, admin_id, screen_id, account_id]
    );
//    DB Query 
//     INSERT INTO screens 
//   (screen_status, screen_type, created_at, updated_at, screen_price, expiry_date, sub_date, 
//   expired, user_id, screen_id, account_id) 
// VALUES 
//   ('empty', 'personal', NOW(), NOW(), 234, NOW(), NOW(), false, 1008976654239694849, 98765, 8079);

    res.status(201).json({ message : "User assigned to screen successfully", addedScreen : addNewScreen.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


/*

Table Structure in Databse 

{
    "table": [
        {
            "id": "1008982135303700481",
            "screen_status": "active",
            "screen_type": "private",
            "created_at": "2024-10-03T20:28:31.407Z",
            "updated_at": "2024-10-03T20:28:31.407Z",
            "screen_price": "250",
            "expiry_date": "2024-10-13T19:00:00.000Z",
            "sub_date": "2024-09-04T19:00:00.000Z",
            "expired": true,
            "user_id": "1008976654239694849",
            "screen_id": "1008978220323635201",
            "account_id": null
        }
    ]
}

*/