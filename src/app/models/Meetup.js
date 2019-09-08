import Sequelize, { Model } from 'sequelize';

class Meetup extends Model {
    static init(sequelize) {
        super.init({
            title: Sequelize.STRING,
            description: Sequelize.STRING,
            location: Sequelize.STRING,
            date: Sequelize.DATE,
            user_id: Sequelize.INTEGER,
        }, { sequelize });

        return this;
    }

    static associate(models) {
        this.hasMany(models.Registration, { foreignKey: 'meetup_id' });
        this.belongsTo(models.User, { foreignKey: 'user_id' });
    }
}

export default Meetup;
