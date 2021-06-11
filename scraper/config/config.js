require("dotenv").config();

module.exports = {
  development: {
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: "mysql_server",
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
    host: "mysql_server",
    dialect: "mysql",
    define: {
      underscored: true,
    },
  },
  production: {
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: "mysql_server",
    dialect: "mysql",
    define: {
      underscored: true,
    },
  },
};
