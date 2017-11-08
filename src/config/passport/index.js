import passport from 'passport';
import GithubStrategy from 'passport-github2';

import { GITHUB } from '../constants';
import models from '../database';

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(new GithubStrategy({
  clientID: GITHUB.id,
  clientSecret: GITHUB.secret,
  callbackURL: 'http://localhost:3001/auth/github/callback'
}, (accessToken, refreshToken, profile, done) => {
  // const user = await models.User.findOne({ where: { username: profile.username } });

  // console.log('user in strat', user);

  console.log(accessToken, refreshToken);

  console.log(profile);

  return done(null, profile);
}));
