import Sequelize from 'sequelize';

import { DB_CONFIG } from './constants';

const sequelize = new Sequelize(DB_CONFIG.url, {
  operatorsAliases: Sequelize.Op
});

const db = {
  User: sequelize.import('../models/user'),
  LocalAuth: sequelize.import('../models/auth/local'),
  SocialAuth: sequelize.import('../models/auth/social')
};

Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

export default db;
