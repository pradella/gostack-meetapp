const error = (res, err, message) => res.status(err).json({ error: message });

export default error;
