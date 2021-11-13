"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // logic for transforming into the new state
    return queryInterface.addColumn("links", "linkImage", Sequelize.STRING);
  },

  down: async (queryInterface, Sequelize) => {
    // logic for reverting the changes
    return queryInterface.removeColumn("links", "linkImage");
  },
};
