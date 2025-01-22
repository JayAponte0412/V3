const mysql = require('mysql2')


// Create a connection (for some reason createPool doesnt work)
const db = mysql.createConnection({
  host: 'localhost',      
  user: 'root',           
  password: 'Jay123456',  
  database: 'myDB'           
});

export default db;


