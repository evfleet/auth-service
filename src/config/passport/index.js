import fetch from 'node-fetch';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import GithubStrategy from 'passport-github2';
import BearerStrategy from 'passport-http-bearer';
import isEmail from 'validator/lib/isEmail';

import { OAUTH } from '../constants';
import models from '../database';

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(new LocalStrategy({
  usernameField: 'account',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, account, password, done) => {
  try {
    const user = await models.User.findOne({
      where: {
        $or: [
          { email: account },
          { username: account }
        ]
      }
    });

    const auth = await (user ? user.getLocalAuth() : false);

    if (!user || !auth) {
      console.log('no user');
    }

    const validPassword = await auth.comparePassword(password);

    if (!validPassword) {

    }

    if (!auth.verified) {

    }

    // return login
  } catch (error) {

  }
}));

passport.use(new GithubStrategy({
  clientID: OAUTH.GITHUB.clientId,
  clientSecret: OAUTH.GITHUB.clientSecret,
  callbackURL: 'http://localhost:3001/authenticate/github/callback',
  passReqToCallback: true
}, async (req, accessToken, refreshToken, { username, id }, done) => {
  try {
    const response = await fetch(`https://api.github.com/user/emails?access_token=${accessToken}`).then((r) => r.json());
    const { email } = response.find((e) => e.primary);
    const [ user, created ] = await models.User.findCreateFind({ where: { email }, defaults: { username } });

    if (created) {
      const auth = await models.SocialAuth.create({
        provider: 'github',
        externalId: id
      });

      await user.addSocialAuth(auth);

      return done(null, { email, username });
    } else {
      return done(null, false);
    }
  } catch (error) {
    console.log('error', error);
    return done(error);
  }
}));

passport.use('bearer', new BearerStrategy((token, done) => {
  try {

  } catch (error) {

  }
}));
