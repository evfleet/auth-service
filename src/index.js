import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';

import './config/passport';
import models from './config/database';
import { SESSION_SECRET } from './config/constants';

const app = express();
const port = 3001;

const SequelizeStore = require('connect-session-sequelize')(session.Store);

app.use(helmet());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  secret: SESSION_SECRET,
  store: new SequelizeStore({
    db: models.sequelize
  }),
  resave: false,
  saveUninitialized: true,
  proxy: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  console.log('user', req.user);

  if (req.isAuthenticated()) {
    res.json({ message: 'Hello logged in' });
  } else {
    res.json({ message: 'Not logged in' });
  }
});

app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

app.get('/auth/github/callback', passport.authenticate('github'), (req, res) => {
  req.session.save(() => {
    res.redirect('/');
  });
});

models.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
});
