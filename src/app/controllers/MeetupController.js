import * as Yup from 'yup';
import { isBefore, parseISO } from 'date-fns';
import error from '../../utils';
import Meetup from '../models/Meetup';
import File from '../models/File';

class MeetupController {
    constructor() {
        this.update = this.update.bind(this);
        this.store = this.store.bind(this);
    }

    // INDEX
    async index(req, res) {
        const allMeetups = await Meetup.findAll({ include: [File] });
        return res.json(allMeetups);
    }

    // GET
    async get(req, res) {
        const oneMeetup = await Meetup.findAll({
            where: { id: req.params.id },
            include: [File],
        });
        if (!oneMeetup) return error(res, 400, 'Meetup does not exist');
        return res.json(oneMeetup);
    }

    // POST
    async store(req, res) {
        // check input data
        if (!await this.isValid(req)) {
            return error(res, 400, 'Validation failed');
        }

        // check if meetup date is future date
        if (isBefore(parseISO(req.body.date), new Date())) {
            return error(res, 400, 'Cannot create meetup with past dates');
        }

        // insert
        const meetupCreated = await Meetup.create(req.body);
        return res.json(meetupCreated);
    }

    // PUT
    async update(req, res) {
        // check input data
        if (!await this.isValid(req)) {
            return error(res, 400, 'Validation failed');
        }

        // check if meetup exists
        const targetMeetup = await Meetup.findByPk(req.params.id);
        if (!targetMeetup) return error(res, 400, 'Meetup does not exists');

        // check if meetup has not passed
        if (isBefore(parseISO(targetMeetup.date), new Date())) {
            return error(res, 400, 'Cannot update past meetups');
        }

        // check if new meetup date is future date
        if (isBefore(parseISO(req.body.date), new Date())) {
            return error(res, 400, 'Cannot update meetup with past dates');
        }

        // check if logged user is the owner
        if (targetMeetup.user_id !== req.loggedUserId) {
            return error(res, 400, 'Cannot update meetup: you are not the owner');
        }

        // update
        const meetupUpdated = await targetMeetup.update(req.body);
        return res.json(meetupUpdated);
    }

    // DELETE
    async delete(req, res) {
        const { id } = req.params;
        const deleteCount = await Meetup.destroy({ where: { id } });
        if (deleteCount === 0) return error(res, 400, 'Cannot delete meetup: seems this meetup does not exists');
        return res.json({ success: true });
    }

    async isValid(req) {
        const schema = Yup.object().shape({
            title: Yup.string().required(),
            description: Yup.string().required(),
            location: Yup.string().required(),
            date: Yup.date().required(),
            user_id: Yup.number().required(),
            file_id: Yup.number().required(),
        });
        return schema.isValid(req.body);
    }
}

export default new MeetupController();
