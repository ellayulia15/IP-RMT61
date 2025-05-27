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
                },
                async isStudent(value) {
                    const user = await sequelize.models.User.findByPk(value);
                    if (!user || user.role !== 'Student') {
                        throw new Error('Only students can make bookings');
                    }
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
                },
                async isAvailable(value) {
                    const schedule = await sequelize.models.Schedule.findByPk(value);
                    if (!schedule || schedule.status === 'cancelled') {
                        throw new Error('This schedule is not available');
                    }
                }
            }
        },
        bookingStatus: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'pending',
            validate: {
                isIn: {
                    args: [['pending', 'approved', 'rejected']],
                    msg: 'Status must be pending, approved, or rejected'
                }
            }
        },
        paymentStatus: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Pending',
        }
    }, {
        sequelize,
        modelName: 'Booking',
        hooks: {
            beforeCreate: async (booking) => {
                // Check for overlapping bookings
                const existingBooking = await Booking.findOne({
                    include: [{
                        model: sequelize.models.Schedule,
                        where: {
                            date: booking.Schedule.date,
                            time: booking.Schedule.time
                        }
                    }],
                    where: {
                        studentId: booking.studentId,
                        bookingStatus: ['Pending', 'Approved']
                    }
                });
                if (existingBooking) {
                    throw new Error('You already have a booking at this time');
                }
            }
        }
    });
    return Booking;
};
