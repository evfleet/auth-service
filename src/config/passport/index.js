import fetch from 'node-fetch';
import passport from 'passport';
import GithubStrategy from 'passport-github2';

import { OAUTH } from '../constants';
import models from '../database';

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(new GithubStrategy({
  clientID: OAUTH.GITHUB.clientId,
  clientSecret: OAUTH.GITHUB.clientSecret,
  callbackURL: 'http://localhost:3001/auth/github/callback',
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    const response = await fetch(`https://api.github.com/user/emails?access_token=${accessToken}`).then((r) => r.json());
    const { email } = response.find((e) => e.primary);

    let user = await models.User.findOne({
      where: {
        email
      }
    });

    if (!user) {
      user = await models.User.create({
        email,
        username: profile.username
      });

      let auth = await models.SocialAuth.create({
        provider: 'github',
        externalId: profile.id
      });

      await user.addSocialAuth(auth);

      return done(null, user);

      // add social auth
    } else {
      // user with that email already exits, figure out how youd like to merge
      return done(null, false);
    }
  } catch (error) {
    console.log('error', error);
    return done(error);
  }
}));
