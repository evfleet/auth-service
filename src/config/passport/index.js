import fetch from 'node-fetch';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import GithubStrategy from 'passport-github2';
import BearerStrategy from 'passport-http-bearer';

import { OAUTH } from '../constants';
import models from '../database';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await models.User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

passport.use(new LocalStrategy({
  usernameField: 'account',
  passwordField: 'password'
}, async (account, password, done) => {
  try {
    console.log('account', account); // evfleet@gmail.com
    console.log('password', password); // 12345678

    const user = await models.User.findOne({
      where: {
        [models.sequelize.Op.or]: [
          { email: account },
          { username: account }
        ]
      }
    });

    console.log('user', user); // correct user, with id 1 etc

    const auth = await (user ? user.getLocalAuth() : false);

    console.log('auth', auth); // correct auth, password hash being $2a$12$x.RudW1A4YRULfkZKD1kL.a9lGb.bWzUWHwQSne6L7SkeR9utqgRG

    // auth/local model method
    const validPassword = await auth.comparePassword(password);

    console.log('valid', validPassword); // always false

    if (!validPassword) {
      return done(null, false, { code: 401, message: 'Invalid account/password combination' });
    }

    if (!auth.verified) {
      return done(null, false, { code: 403, message: 'Email has not been verified' });
    }

    done(null, user);
  } catch (error) {
    done(error);
  }
}));

passport.use(new GithubStrategy({
  clientID: OAUTH.GITHUB.clientId,
  clientSecret: OAUTH.GITHUB.clientSecret,
  callbackURL: 'http://localhost:3001/authenticate/github/callback',
  passReqToCallback: true
}, async (accessToken, refreshToken, { username, id }, done) => {
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
