const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/user');

passport.use(
    new GoogleStrategy(
        // Configuration object
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK,
        },
        // The verify callback function...
        // Marking a function as an async function allows us
        // to consume promises using the await keyword
        async function (accessToken, refreshToken, profile, cb) {
            // When using async/await  we use a
            // try/catch block to handle an error
            try {
                // A user has logged in with OAuth...
                let user = await User.findOne({ googleId: profile.id });
                // Existing user found, so provide it to passport
                if (user) return cb(null, user);
                // We have a new user via OAuth!
                user = await User.create({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    avatar: profile.photos[0].value,
                });
                return cb(null, user);
            } catch (err) {
                return cb(err);
            }
        }
    )
);
// turns the user object into string to send as HTML
passport.serializeUser((user, cb) => {
    cb(null, user._id);
});

// turns the user string into an object again
passport.deserializeUser(async (userId, cb) => {
    cb(null, await User.findById(userId));
});
