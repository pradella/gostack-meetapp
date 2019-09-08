// conexão com banco de dados e carregar os models
import Sequelize from 'sequelize';

import User from '../app/models/User';
import databaseConfig from '../config/database';
import Meetup from '../app/models/Meetup';

const models = [User, Meetup];

class Database {
    constructor() {
        this.init();
    }

    init() {
        this.connection = new Sequelize(databaseConfig);

        models.map((model) => model.init(this.connection));
    }
}

export default new Database();
