import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'https://full-stact-expense-tracker.onrender.com/api/v1/google/callback', // Make sure this matches your API URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user already exists in the database
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // If user doesn't exist, create a new user with Google profile data
          user = new User({
            googleId: profile.id,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            photo: profile.photos[0].value,  // You can save the profile picture as well if needed
          });

          // Save the new user
          await user.save();
        }

        // Pass the user object to the next middleware (done function)
        return done(null, user);
      } catch (error) {
        console.error('Error in Google OAuth:', error);
        return done(error, null);
      }
    }
  )
);

// Store the user in session (if using sessions), or just pass the user to the JWT strategy
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
