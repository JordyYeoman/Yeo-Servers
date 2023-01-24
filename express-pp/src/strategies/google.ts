import passport from "passport";
import { Profile, VerifyCallback } from "passport-google-oauth20";
var GoogleStrategy =
  require("../../node_modules/passport-google-oauth2").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      callbackURL: process.env.GOOGLE_REDIRECT_URL,
      scope: ["email", "profile"],
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      console.log("Access token: ", accessToken);
      console.log("Refresh token: ", refreshToken);
      console.log("profile: ", profile);
      done(null, undefined);
    }
  )
);
