export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true
    }
  });

  User.associate = (models) => {
    User.hasOne(models.LocalAuth, { foreignKey: 'userId' });
    User.hasMany(models.SocialAuth, { foreignKey: 'userId' });
  };

  return User;
};