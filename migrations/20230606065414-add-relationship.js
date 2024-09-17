'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('ZoneTags', {
      fields: ['zoneId'],
      type: 'foreign key',
      name: 'fk_zone_tag_zone',
      references: {
        table: 'Zones',
        field: 'zoneId',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('ZoneTags', 'fk_zone_tag_zone');
  },
};
