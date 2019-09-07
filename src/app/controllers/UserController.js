import * as Yup from 'yup';
import User from '../models/User';
import error from '../../utils';

class UserController {
    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().required(),
            password_hash: Yup.string().required().min(4),
        });

        if (!await schema.isValid(req.body)) {
            return error(res, 400, 'Validation failed');
        }

        const userExists = User.findOne({ where: { email: req.body.email } });
        if (userExists) {
            return error(res, 400, 'User already exists');
        }

        const userCreated = await User.create(req.body);
        return res.json(userCreated);
    }
}

export default new UserController();
