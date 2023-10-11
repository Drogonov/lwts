const dbConfig = require("./db.config");
const mysql = require('mysql2/promise')
const Sequelize = require("sequelize");

const db = {};

async function initializeDataBase() {
   // create db if it doesn't already exist
   const connection = await mysql.createConnection({ 
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password
    })
   await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.db}\`;`)

   // connect to db
   const sequelize = new Sequelize(
      dbConfig.db,
      dbConfig.user, 
      dbConfig.password,
      {
         host: dbConfig.host,
         dialect: dbConfig.dialect,
         operatorsAliases: false,
         connectTimeout: 10000,
         acquireTimeout: 10000,
         waitForConnections: true,
         queueLimit: 0,
         pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
         },
         define: {
            charset: 'utf8',
            collate: 'utf8_general_ci'
          }
      }
   );

   db.Sequelize = Sequelize;
   db.sequelize = sequelize;
   db.users = require("./models/user.model")(sequelize, Sequelize);

   // sync all models with database
   db.sequelize.sync()
   .then(() => {
      console.log("Synced db.");
   })
   .catch((err) => {
      console.log("Failed to sync db: " + err.message);
   });
}

module.exports = { db, initializeDataBase };