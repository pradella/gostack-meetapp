import express from 'express';
import path from 'path';
import routes from './routes';
import './database';

class App {
    constructor() {
        this.server = express();

        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.server.use(express.json());

        // means that files route will serve static files, point to temp/uploads folder
        this.server.use(
            '/files',
            express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')),
        );
    }

    routes() {
        this.server.use(routes);
    }
}

export default new App().server;
