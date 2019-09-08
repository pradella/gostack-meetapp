
module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.changeColumn(
        'meetups', 'user_id', {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: 'users', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
    ),

    down: (queryInterface, Sequelize) => queryInterface.changeColumn(
        'meetups', 'user_id', {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    ),
};
