
module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.changeColumn(
        'meetups', 'owner', {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: 'users', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
    ),

    down: (queryInterface, Sequelize) => queryInterface.changeColumn(
        'meetups', 'owner', {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    ),
};
