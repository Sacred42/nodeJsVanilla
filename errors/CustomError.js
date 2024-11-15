class CustomError extends Error {
    constructor({ error, status, message }) {

        if (error instanceof CustomError) {
            return error;
        }
        else if (message && status) {
            super(message);
            this.status = status;
        }
        else {
            super(error.message);
            this.status = 500;
        };

    }
}

module.exports = CustomError