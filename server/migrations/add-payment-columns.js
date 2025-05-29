'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Bookings', 'paymentToken', {
            type: Sequelize.STRING,
            allowNull: true
        });
        await queryInterface.addColumn('Bookings', 'paymentUrl', {
            type: Sequelize.STRING,
            allowNull: true
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Bookings', 'paymentToken');
        await queryInterface.removeColumn('Bookings', 'paymentUrl');
    }
};