import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';

import './config/passport';
import routes from './routes';
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
  saveUninitialized: false,
  resave: false,
  proxy: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', routes);

/*
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

app.get('/auth/github/callback', passport.authenticate('github'), (req, res) => {
  req.session.save(() => {
    res.redirect('/');
  });
});
*/

models.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
});
