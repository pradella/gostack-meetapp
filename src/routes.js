import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import MeetupController from './app/controllers/MeetupController';
import RegisterController from './app/controllers/RegisterController';

const routes = new Router();

routes.get('/', (req, res) => res.json({ message: 'hello world' }));
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

// users
routes.get('/users', UserController.index);
routes.get('/users/:id', UserController.get);
routes.post('/users', UserController.store);
routes.put('/users/:id', UserController.update);
routes.delete('/users/:id', UserController.delete);

// meetups
routes.get('/meetups', MeetupController.index);
routes.get('/meetups/:id', MeetupController.get);
routes.post('/meetups', MeetupController.store);
routes.put('/meetups/:id', MeetupController.update);
routes.delete('/meetups/:id', MeetupController.delete);

// register
routes.post('/register/:id', RegisterController.store);
routes.delete('/register/:id', RegisterController.delete);

export default routes;
