import * as Yup from 'yup';
import jwt from 'jsonwebtoken';
import error from '../../utils';
import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
    async store(req, res) {
        // check input data
        const schema = Yup.object().shape({
            email: Yup.string().required(),
            password: Yup.string().required(),
        });
        if (!await schema.isValid(req.body)) {
            return error(res, 400, 'You must inform email and password');
        }

        // check user exists (match email and password)
        const { email, password } = req.body;
        const userExists = await User.findOne({ where: { email } });
        if (userExists && !await userExists.checkPassword(password)) {
            return error(res, 400, 'Email and/or password incorrect');
        }

        // return token
        const { id, name } = userExists;
        const token = jwt.sign({ id }, authConfig.secret, {
            expiresIn: authConfig.expiresIn,
        });
        return res.json({
            id,
            name,
            token,
        });
    }
}

export default new SessionController();
