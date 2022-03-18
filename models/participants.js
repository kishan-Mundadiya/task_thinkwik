module.exports = function (sequelize, Sequelize) {
    return sequelize.define('participants', {
        participant_id: {
            type: Sequelize.DataTypes.STRING(70),
            allowNull: false
        },
        event_id: {
            type: Sequelize.DataTypes.STRING(70),
            allowNull: false
        },
        e_name: {
            type: Sequelize.DataTypes.STRING(40),
            allowNull: false
        },

        e_place: {
            type: Sequelize.DataTypes.STRING(70),
            allowNull: false
        },
        u_name: {
            type: Sequelize.DataTypes.STRING(40),
            allowNull: true
        },
        u_email: {
            type: Sequelize.DataTypes.STRING(40),
            allowNull: false
        },
    }, {
        timeStamp: false,
        tableName: 'participants',
        freezeTableName: true
    });
};