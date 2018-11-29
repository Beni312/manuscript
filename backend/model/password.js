module.exports = function(sequelize, DataTypes) {
  return sequelize.define('password', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    password: {
      type: DataTypes.STRING
    },
    expiryDate: {
      type: DataTypes.DATE
    },
    salt: {
      type: DataTypes.STRING
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "user",
        key: "id"
      }
    }
  });
};
