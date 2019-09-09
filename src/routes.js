import { Router } from 'express';
import multer from 'multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import MeetupController from './app/controllers/MeetupController';
import RegistrationController from './app/controllers/RegistrationController';
import multerConfig from './config/multer';
import FileController from './app/controllers/FileController';

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
routes.get('/register/', RegistrationController.index);
routes.post('/register/:id', RegistrationController.store);
routes.delete('/register/:id', RegistrationController.delete);

// file
const upload = multer(multerConfig);
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
