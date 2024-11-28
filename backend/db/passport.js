import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.js"; 
import dotenv from "dotenv";
import { BACK_END_URL } from "../constants/constants.js";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        `${BACK_END_URL}/api/v1/google/callback`, 
      passReqToCallback: true,
      scope: ["profile", "email"],
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google Profile:", JSON.stringify(profile, null, 2));

        // Extract fields with fallbacks
        const firstName = profile.name?.givenName || "Unknown";
        const lastName = profile.name?.familyName || "Unknown";
        const email = profile.emails?.[0]?.value;

        if (!email) {
          console.error("Google profile is missing email:", profile);
          return done(new Error("Google login failed: No email provided"));
        }

        
        let user = await User.findOne({
          $or: [{ googleId: profile.id }, { email: email }],
        });

        if (!user) {
          // Create new user if no match is found
          user = await User.create({
            googleId: profile.id,
            firstName,
            lastName,
            email,
          });
        } else {
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
        }

        return done(null, user);
      } catch (error) {
        console.error("Google Strategy Error:", error);
        return done(error, null);
      }
    }
  )
);

export default passport;
