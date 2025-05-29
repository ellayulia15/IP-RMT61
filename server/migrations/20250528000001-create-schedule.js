'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Schedules', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            TutorId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Tutors',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            date: {
                type: Sequelize.DATE,
                allowNull: false
            },
            time: {
                type: Sequelize.STRING,
                allowNull: false
            },
            fee: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Schedules');
    }
};
