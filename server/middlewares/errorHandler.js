function errorHandler(err, req, res, next) {
    let status = err.status || 500;
    let message = err.message || 'Internal Server Error';

    switch (err.name) {
        case 'SequelizeForeignKeyConstraintError':
            status = 400;
            message = 'Referenced data does not exist';
            break;
        case 'SequelizeDatabaseError':
            status = 400;
            message = 'Invalid data format';
            break;
        case 'SequelizeValidationError':
        case 'SequelizeUniqueConstraintError':
            status = 400;
            message = err.errors[0].message;
            break;
        case 'BadRequest':
            status = 400;
            message = err.message;
            break;
        case 'JsonWebTokenError':
            status = 401;
            message = 'Invalid token';
            break;
        case 'Unauthorized':
            status = 401;
            message = err.message;
            break;
        case 'Forbidden':
            status = 403;
            message = err.message;
            break;
        case 'NotFound':
            status = 404;
            message = err.message;
            break;
    }

    res.status(status).json({ message });
}

module.exports = errorHandler;