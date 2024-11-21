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

        // Extract fields with fallbacks
        const firstName = profile.name?.givenName || 'Unknown';
        const lastName = profile.name?.familyName || 'Unknown';
        const email = profile.emails?.[0]?.value;

        if (!email) {
          throw new Error('Google profile does not include an email.');
        }

        // Find user by Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // If user doesn't exist by Google ID, check by email
          user = await User.findOne({ email });

          if (!user) {
            // Create new user if no match is found
            user = await User.create({
              googleId: profile.id,
              firstName,
              lastName,
              email,
            });
          } else {
            // Update existing user's Google ID if it was missing
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
