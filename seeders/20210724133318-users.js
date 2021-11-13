"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    await queryInterface.bulkInsert(
      "users",
      [
        {
          email: "admin@mail.com",
          password:
            "$2b$10$oSsRLk8xx121cyqEVGgNG.WE/0WcDAMWMm2xaTrUiEepLyZubpxT2", //1234567
          fullName: "admin",
          role: "admin",
          createdAt: "2021-11-04 13:46:10",
          updatedAt: "2021-11-04 19:19:20",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
