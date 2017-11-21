import bcrypt from 'bcrypt';
import crypto from 'crypto';

async function hashPassword(auth) {
  auth.password = await bcrypt.hash(auth.password, 12);
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
    return bcrypt.compare(password, this.password);
  };

  return LocalAuth;
};