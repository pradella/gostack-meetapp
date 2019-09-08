import { isBefore, parseISO } from 'date-fns';
import error from '../../utils';
import Register from '../models/Register';
import Meetup from '../models/Meetup';
import User from '../models/User';

class RegisterController {
    // GET
    async index(req, res) {
        const allRegistrations = await Register.findAll({
            include: [{
                model: Meetup,
                required: true,
            }, {
                model: User,
                required: true,
            }],
        });
        return res.json(allRegistrations);
    }

    // POST
    async store(req, res) {
        // get the meetup
        const meetupId = req.params.id;
        const { loggedUserId } = req;
        const desiredMeetup = await Meetup.findByPk(meetupId);
        if (!desiredMeetup) return error(res, 400, 'Meetup does not exist');

        // O usuário deve poder se inscrever em meetups que não organiza.
        if (desiredMeetup.owner === loggedUserId) {
            return error(res, 400, 'You cannot register in meetups that you are the owner');
        }

        // O usuário não pode se inscrever em meetups que já aconteceram.
        if (isBefore(parseISO(desiredMeetup.date), new Date())) {
            return error(res, 400, 'You cannot register in past meetups');
        }

        // O usuário não pode se inscrever no mesmo meetup duas vezes.
        const hasAlreadyRegistered = await Register.findOne({
            where: { meetup_id: meetupId },
        });
        if (hasAlreadyRegistered) {
            return error(res, 400, 'You are already registered in this meetup');
        }

        // O usuário não pode se inscrever em dois meetups que acontecem no mesmo horário.
        const hasRegistrationOnSameDate = await Register.findOne({
            where: { user_id: loggedUserId },
            include: [{
                model: Meetup,
                required: true,
                where: {
                    date: desiredMeetup.date,
                },
            }],
        });
        if (hasRegistrationOnSameDate) {
            return error(res, 400, 'You cannot register in two meetups at the same time');
        }

        // insert
        const registerCreated = await Register.create({
            meetup_id: meetupId, user_id: loggedUserId,
        });

        // send notification email
        // PENDING

        return res.json(registerCreated);
    }

    // DELETE
    async delete(req, res) {
        const meetupId = req.params.id;
        const { loggedUserId } = req;
        const deleteCount = await Register.destroy({
            where: { meetup_id: meetupId, user_id: loggedUserId },
        });
        if (deleteCount === 0) return error(res, 400, 'Cannot delete meetup registration: seems this meetup does not exists');
        return res.json({ success: true });
    }
}

export default new RegisterController();
