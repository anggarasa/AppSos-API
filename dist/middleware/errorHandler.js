"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    console.error(err);
    if (err.name === 'PrismaClientValidationError') {
        const message = 'Invalid data input';
        error = { name: 'ValidationError', message, statusCode: 400 };
    }
    if (err.name === 'PrismaClientKnownRequestError') {
        const message = 'Database operation failed';
        error = { name: 'DatabaseError', message, statusCode: 400 };
    }
    res.status(error.statusCode || 500).json({
        success: false,
        error: {
            message: error.message || 'Server Error',
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map