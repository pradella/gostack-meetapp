
module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.addColumn(
        'meetups',
        'file_id',
        {
            type: Sequelize.INTEGER,
            references: { model: 'files', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
    ),

    down: (queryInterface) => queryInterface.removeColumn(
        'meetups',
        'file_id',
    ),
};
