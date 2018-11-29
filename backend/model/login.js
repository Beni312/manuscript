module.exports = function(sequelize, DataTypes) {
  return sequelize.define('login', {
    username: {
      type: DataTypes.STRING,
      references: {
        model: 'userAlias',
        key: 'username'
      }
    },
    passwordId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'password',
        key: 'id'
      }
    },
    failedLoginCounter: {
      type: DataTypes.TINYINT,
      defaultValue: 0
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });
};
