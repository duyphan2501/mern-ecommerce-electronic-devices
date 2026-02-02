const errorHandler = (err, req, res, next) => {
    console.error("--- Error Stack ---");
    console.error(err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        message: message,
    });
};

export default errorHandler;
