import Sequelize, { Model } from 'sequelize';

class Register extends Model {
    static init(sequelize) {
        super.init({
            meetup_id: Sequelize.INTEGER,
            user_id: Sequelize.INTEGER,
        }, { sequelize });

        return this;
    }
}

export default Register;
