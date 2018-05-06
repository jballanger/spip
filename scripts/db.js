const mysql = require('mysql2');
const fs = require('fs');
const config = require('../config.json');

const connection = mysql.createConnection({
  host: config.database.mysql.host,
  user: config.database.mysql.user,
  password: config.database.mysql.pass,
  database: config.database.mysql.database,
  multipleStatements: true,
});

async function exec(sql) {
  connection.query(sql, (err) => {
    if (err) throw new Error(err);
    connection.end();
    console.log('All done!');
    process.exit(0);
  });
}

fs.readFile('sql/spip.sql', 'utf8', (err, data) => {
  if (err) throw new Error(err);
  exec(data);
});
