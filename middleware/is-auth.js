const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers['x-access-token'];

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'secretKey');
    } catch (err) {
        err.statusCode = 500;
        console.log('modified or nonexistent token!');
        res.send('login again');
        throw err;
    }
    if (!decodedToken) {
        const error = new Error('not authenticated!');
        console.log('no token!');
        res.send('unauthorized');
        error.statusCode = 401;
        throw error;
    }
    // res.locals.id = decodedToken.id; // ALL THESE REACH ROUTES
    // res.locals.username = decodedToken.username; // email used for teacherroutes
    // res.locals.name = decodedToken.name;
    // console.log('user logged in!');

    req.user = decodedToken;

    next();
};
