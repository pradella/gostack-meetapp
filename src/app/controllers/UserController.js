import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
      password_hash: Yup.string().required().min(4),
    });

    if (!await schema.isValid(req.body)) {
      res.status(400).json({ error: 'Validation failed' });
    }

    const userCreated = await User.create(req.body);

    return res.json(userCreated);
  }
}

export default new UserController();
