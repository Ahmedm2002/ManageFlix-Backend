const { Pool } = require('pg')

const pool = new Pool({
  user:"root_application",
  host:"applications-10324.7tc.aws-eu-central-1.cockroachlabs.cloud",
  password:"d67gCsGV8SuuKakhBuq_fw",
  database:"Mflix_db",
  port:"26257",
  ssl:{
    rejectUnauthorized:false
  },
})

module.exports = { pool }