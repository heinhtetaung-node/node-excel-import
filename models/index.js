const dbConfig = require("../config/mysqldb.js");

const { Sequelize, Model, DataTypes, QueryTypes } = require('sequelize');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.dialect,  

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.chart = require("./chart.model.js")(sequelize, Model, DataTypes, db);
db.department = require("./department.model.js")(sequelize, Model, DataTypes, db);
db.employee = require("./emp.model.js")(sequelize, Model, DataTypes, db);
db.employee.belongsTo(db.department);
db.department.hasMany(db.employee);
module.exports = db;