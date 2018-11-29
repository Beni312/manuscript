module.exports = function(sequelize, DataTypes) {
  return sequelize.define('userAlias', {
    username: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id'
      }
    }
  });
};
