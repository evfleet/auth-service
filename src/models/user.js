export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING
    },
    username: {
      type: DataTypes.STRING
    }
  });

  User.associate = (models) => {
    User.hasOne(models.LocalAuth);

    User.hasMany(models.SocialAuth, { foreignKey: 'userId' });
  };

  return User;
};