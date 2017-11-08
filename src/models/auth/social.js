export default (sequelize, DataTypes) => {
  const SocialAuth = sequelize.define('SocialAuth', {
    provider: {
      type: DataTypes.STRING
    },
    externalId: {
      type: DataTypes.STRING
    }
  });

  return SocialAuth;
};