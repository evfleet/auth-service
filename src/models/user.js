export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING
    }
  });

  User.associate = (models) => {
    User.hasOne(models.LocalAuth);
  };

  return User;
};