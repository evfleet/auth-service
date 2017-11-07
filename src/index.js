import express from 'express';

import session from 'express-session';

import models from './models';

const app = express();
const port = 3001;

const SequelizeStore = require('connect-session-sequelize')(session.Store);

app.use(session({
  secret: '123',
  store: new SequelizeStore({
    db: models.sequelize
  }),
  resave: false,
  saveUninitialized: true,
  proxy: true
}));

app.get('/', (req, res) => {
  res.json({
    auth: true
  });
});

models.sequelize.sync({ force: true }).then(() => {
  app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
});
