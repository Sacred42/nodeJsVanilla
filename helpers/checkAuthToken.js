const checkAuthToken = (req, res, next) => {
    const cookie = req.headers.cookie;
    if (cookie) {
        const token = cookie.split('=')[1];
        if (auth.validationToken(token, 'access')) {
            next();
        } else {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    } else {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}