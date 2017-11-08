export default (sequelize, DataTypes) => {
  const LocalAuth = sequelize.define('LocalAuth', {
    email: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    }
  });

  return LocalAuth;
};