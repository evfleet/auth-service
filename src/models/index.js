import Sequelize from 'sequelize';

import { DB_CONFIG } from '../config/constants';

const sequelize = new Sequelize(DB_CONFIG.url, {
  operatorsAliases: Sequelize.Op
});

const db = {
  User: sequelize.import('./user')
};

Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

export default db;
