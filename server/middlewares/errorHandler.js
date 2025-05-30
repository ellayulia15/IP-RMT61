function errorHandler(err, req, res, next) {
    switch (err.name) {
        case 'SequelizeValidationError':
        case 'SequelizeUniqueConstraintError':
            res.status(400).json({ message: err.errors[0].message });
            break;
        case 'BadRequest':
            res.status(400).json({ message: err.message });
            break;
        case 'JsonWebTokenError':
            res.status(401).json({ message: 'Invalid token' });
            break;
        case 'Unauthorized':
            res.status(401).json({ message: err.message });
            break;
        case 'Forbidden':
            res.status(403).json({ message: err.message });
            break;
        case 'NotFound':
            res.status(404).json({ message: err.message });
            break;
        default:
            res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
            break;
    }
}

module.exports = errorHandler;