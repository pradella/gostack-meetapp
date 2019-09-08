import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import error from '../../utils';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
    // check auth header exists
    const { authorization } = req.headers;
    if (!authorization) {
        return error(res, 401, 'Authorization header not found');
    }

    // check token exists
    const [, token] = authorization.split(' ');
    if (!token) {
        return error(res, 401, 'Token not found');
    }

    // check if token is valid
    try {
        await promisify(jwt.verify)(token, authConfig.secret);
        return next();
    } catch (err) {
        return error(res, 401, 'Token invalid');
    }
};
