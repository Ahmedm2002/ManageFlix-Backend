const express = require('express')
const { pool } = require('../../dbConfig')
const router = express.Router();


router.get('/:admin_id', async (req, res) => {
  const { admin_id } = req.params
  console.log(admin_id)
  try {
    const adminAccounts = await pool.query('Select * from accounts where admin_id = $1',[admin_id])
    res.status(200).json({ accounts : adminAccounts.rows})
  } catch (error) {
    res.status(500).json({error: error.message})
  }
})

router.post('/add-account',async(req, res) => {
  const { admin_id, login_email, password } = req.body;
  const service_name = "Netflix"
  try {
    const id = Math.round(Math.random() * 100000000000)

    const addedAccount = await pool.query('insert into accounts (id, service_name, login_email, password, admin_id) values ($1, $2, $3, $4, $5) RETURNING * ',[id, service_name, login_email, password, admin_id])

    res.status(201).json({message:"Account created successsfully", account: addedAccount.rows})
  } catch (error) {
    res.status(500).json({error: error.message})
  }
})


module.exports = router