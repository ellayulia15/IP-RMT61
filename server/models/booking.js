'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Booking extends Model {
        static associate(models) {
            // define association here
            Booking.belongsTo(models.User, {
                foreignKey: 'studentId',
                as: 'Student'
            });
            Booking.belongsTo(models.Schedule, {
                foreignKey: 'ScheduleId'
            });
        }
    }
    Booking.init({
        studentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Student ID is required'
                }, notNull: {
                    msg: 'Student ID is required'
                }
            }
        },
        ScheduleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Schedule ID is required'
                }, notNull: {
                    msg: 'Schedule ID is required'
                }
            }
        },
        bookingStatus: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Pending',
        },
        paymentToken: {
            type: DataTypes.STRING,
            allowNull: true
        },
        paymentUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        paymentStatus: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Pending', validate: {
                isIn: [['Pending', 'paid', 'failed', 'expired', 'cancelled']]
            }
        }
    }, {
        sequelize,
        modelName: 'Booking',
    });
    return Booking;
};
