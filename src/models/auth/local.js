export default (sequelize, DataTypes) => {
  const LocalAuth = sequelize.define('LocalAuth', {
    password: {
      type: DataTypes.STRING
    }
  });

  return LocalAuth;
};