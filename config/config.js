require("dotenv").config();

module.exports = {
  development: {
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: "127.0.0.1",
    dialect: "mysql",
    define: {
      underscored: true,
    },
    logging: false,
  },
  test: {
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: "127.0.0.1",
    dialect: "mysql",
    define: {
      underscored: true,
    },
  },
  production: {
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: "127.0.0.1",
    dialect: "mysql",
    define: {
      underscored: true,
    },
  },
};