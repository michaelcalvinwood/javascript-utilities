const mysql = require('mysql');

const dbPoolInfo = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT),
    queueLimit: Number(process.env.DB_QUEUE_LIMIT),
    charset: 'utf8'
  }
  
dbPool = mysql.createPool(dbPoolInfo);

dbPool.on('connection', function (connection) {
    console.log('DB Connection established');
  
    connection.on('error', function (err) {
      console.error(new Date(), 'MySQL error', err.code);
    });
    connection.on('close', function (err) {
      console.error(new Date(), 'MySQL close', err);
    });
  
  });

function sqlQuery (query, pool) {
    return new Promise ((resolve, reject) => {
        pool.query((err, res, fields) => {
            if (err) {
                reject(err);
                return;
            }
            resolve({
                res,
                fields
            })
        })
    })
}
