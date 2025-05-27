'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Schedule extends Model {
        static associate(models) {
            // define association here
            Schedule.belongsTo(models.Tutor, {
                foreignKey: 'TutorId'
            });
            Schedule.hasMany(models.Booking, {
                foreignKey: 'ScheduleId'
            });
        }
    }
    Schedule.init({
        TutorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Tutor ID is required'
                }, notNull: {
                    msg: 'Tutor ID is required'
                }
            }
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Date is required'
                }, notNull: {
                    msg: 'Date is required'
                },
                isAfterToday(value) {
                    if (value < new Date()) {
                        throw new Error('Date cannot be in the past');
                    }
                }
            }
        },
        time: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Time is required'
                },
                notNull: {
                    msg: 'Time is required'
                },
            }
        },
        fee: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Fee is required'
                }, notNull: {
                    msg: 'Fee is required'
                },
                min: {
                    args: [0],
                    msg: 'Fee cannot be negative'
                }
            }
        }
    }, {
        sequelize,
        modelName: 'Schedule',
    });
    return Schedule;
};
