import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import User from '../models/user.js';

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'https://full-stact-expense-tracker.onrender.com/api/v1/google/callback', 
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Try to find an existing user by Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // If the user doesn't exist by Google ID, check by email
          user = await User.findOne({ email: profile.emails[0].value });

          if (!user) {
            // If no user exists by email, create a new user
            user = await User.create({
              googleId: profile.id,
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              email: profile.emails[0].value,
            });
          } else {
            // If user exists by email but doesn't have Google ID, update the Google ID
            user.googleId = profile.id;
            await user.save();
          }
        }

        // If the user is found, return the user object
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
