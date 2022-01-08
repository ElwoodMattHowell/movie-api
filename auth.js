// Authenticate users when they login and generate a JWT token to authenticate future requests and
// created a new endpoint for registered users to login

// This must be the same key used in JWTStrategy
const jwtSecret = 'your_jwt_secret';

const jwt = require('jsonwebtoken'),
  passport = require('passport');

//local passport file
require('./passport.js');

let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.username, //this is the username you are encoding in the JWT
    expiresIn: '7d', //Token expires in 7 days
    algorithm: 'HS256' //Algorithm used to encode the values of JWT
  });
}

//Creates new login endpoint and checks if username and password exist
module.exports = (router) => {
  router.use(passport.initialize());
  router.post('/login', (req, res) => {
    passport.authenticate('local', {session: false },
  (error, user, info) => {
    if (error || !user) {
      return res.status(400).json({
        message: 'Something is not right',
        user: user
      });
    }
    req.login(user, { session: false }, (error) => {
      if (error) {
        res.send(error);
      }
      let token = generateJWTToken(user.toJSON());
      return res.json({ user, token});
    });
  }) (req, res);
});
};
