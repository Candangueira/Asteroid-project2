const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index');
const passport = require('passport');

router.get('/', indexController.index);

router.get(
    '/auth/google',
    // The passport.authenticate() method will return a middleware function that does the coordinating with Google's OAuth server.The user will be presented the consent screen if they haven't previously consented.
    passport.authenticate(
        // Which passport strategy is being used?
        'google',
        {
            // Requesting the user's profile and email
            scope: ['profile', 'email'],
            // Optionally force pick account every time
            // prompt: "select_account"
        }
    )
);

// Google OAuth callback route
router.get(
    '/oauth2callback',
    passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/',
    })
);

// OAuth logout route
router.get('/logout', function (req, res) {
    req.logout(function () {
        res.redirect('/');
    });
});

// router.post('/asteroids', indexController.addDate);

module.exports = router;
