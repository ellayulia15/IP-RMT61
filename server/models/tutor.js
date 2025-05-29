'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Tutor extends Model {
        static associate(models) {
            // define association here
            Tutor.belongsTo(models.User, {
                foreignKey: 'UserId',
                // This ensures only users with role='Tutor' can have profiles
                scope: {
                    role: 'Tutor'
                }
            });
            Tutor.hasMany(models.Schedule, {
                foreignKey: 'TutorId'
            });
        }
    }
    Tutor.init({
        UserId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'User ID is required'
                },
                async isTutor(value) {
                    const user = await sequelize.models.User.findByPk(value);
                    if (!user || user.role !== 'Tutor') {
                        throw new Error('Only users with role Tutor can create a tutor profile');
                    }
                }
            }
        },
        photoUrl: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Photo URL is required'
                },
                notNull: {
                    msg: 'Photo URL is required'
                },
                isUrl: {
                    msg: 'Must be a valid URL'
                }
            }
        },
        subjects: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Subject is required'
                },
                notNull: {
                    msg: 'Subject is required'
                }
            }
        },
        style: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Teaching style is required'
                },
                notNull: {
                    msg: 'Teaching style is required'
                }
            }
        }
    }, {
        sequelize,
        modelName: 'Tutor',
    });
    return Tutor;
};
