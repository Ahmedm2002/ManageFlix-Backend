const express = require('express')
const app = express()
const port = 5000
const { pool } = require('./dbConfig')
require('dotenv').config();

app.use(express.json())

// Import Routes
const admin = require('./routes/Admins/AdminAuth')
const accounts = require('./routes/Accounts/accounts')
const screens = require('./routes/Screens/screens')

// Files for each endpoint
app.use('/admin', admin)
app.use('/accounts', accounts)
app.use('/screens', screens)


app.get('/', (req, res) => {
  res.send('This is the backend for the ManageFlix Application!')
})



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
    `)
})

async function checkDbConnection(){
  try {
    const result = await pool.query('select now()')
    if(result){
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



checkDbConnection()
