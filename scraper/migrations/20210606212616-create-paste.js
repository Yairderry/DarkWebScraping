"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Pastes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      paste_id: {
        type: Sequelize.STRING,
      },
      title: {
        type: Sequelize.STRING,
      },
      content: {
        type: Sequelize.TEXT("long"),
      },
      author: {
        type: Sequelize.STRING,
      },
      date: {
        type: Sequelize.DATE,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Pastes");
  },
};
