import argon2 from 'argon2';
import crypto from 'crypto';

async function hashPassword(auth) {
  auth.password = await argon2.hash(auth.password, { type: argon2.argon2i });
}

export default (sequelize, DataTypes) => {
  const LocalAuth = sequelize.define('LocalAuth', {
    password: {
      type: DataTypes.STRING,
      required: true
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    verificationToken: {
      type: DataTypes.STRING,
      defaultValue: crypto.randomBytes(32).toString('hex')
    },
    resetExpiration: {
      type: DataTypes.DATE
    },
    resetToken: {
      type: DataTypes.STRING
    }
  }, {
    hooks: {
      beforeCreate: hashPassword,
      beforeUpdate: hashPassword
    }
  });

  LocalAuth.prototype.comparePassword = async function(password) {
    return argon2.verify(this.password, password);
  };

  return LocalAuth;
};