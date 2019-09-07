import * as Yup from 'yup';
import User from '../models/User';
import error from '../../utils';

class UserController {
    constructor() {
        this.update = this.update.bind(this);
        this.store = this.store.bind(this);
    }

    // INDEX
    async index(req, res) {
        const allUsers = await User.findAll();
        return res.json(allUsers);
    }

    // GET
    async get(req, res) {
        const oneUser = await User.findByPk(req.params.id);
        if (!oneUser) return error(res, 400, 'User does not exist');
        return res.json(oneUser);
    }

    // POST
    async store(req, res) {
        // check input data
        if (!await this.isValid(req)) {
            return error(res, 400, 'Validation failed');
        }

        // check user with this email exists
        const userExists = await User.findOne({ where: { email: req.body.email } });
        if (userExists) {
            return error(res, 400, 'User already exists');
        }

        // insert
        const userCreated = await User.create(req.body);
        return res.json(userCreated);
    }

    // PUT
    async update(req, res) {
        // check input data
        if (!await this.isValid(req)) {
            return error(res, 400, 'Validation failed');
        }

        // check if user exists
        const targetUser = await User.findByPk(req.params.id);
        if (!targetUser) return error(res, 400, 'User does not exists');

        // check if is trying to change email to an existing email
        if (req.body.email !== targetUser.email) {
            const emailExists = await User.findOne({ where: { email: req.body.email } });
            if (emailExists) return error(res, 400, 'Email already exists');
        }

        // update
        const userUpdated = await targetUser.update(req.body);
        return res.json(userUpdated);
    }

    // DELETE
    async delete(req, res) {
        const { id } = req.params;
        const deleteCount = await User.destroy({ where: { id } });
        if (deleteCount === 0) return error(res, 400, 'Cannot delete user: seems this user does not exists');
        return res.json({ success: true });
    }

    async isValid(req) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().required(),
            password_hash: Yup.string().required().min(4),
        });
        return schema.isValid(req.body);
    }
}

export default new UserController();
