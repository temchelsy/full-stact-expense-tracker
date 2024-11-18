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
        console.log('Google Profile:', profile);

        
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          
          user = await User.findOne({ email: profile.emails[0].value });

          if (!user) {
            
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

        return done(null, user);
      } catch (error) {
        console.error('Error in Google Strategy:', error);
        return done(error, null);
      }
    }
  )
);
