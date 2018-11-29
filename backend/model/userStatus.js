module.exports = function(sequelize, DataTypes) {
  return sequelize.define('userStatus', {
    id: {
      type: DataTypes.TINYINT,
      autoIncrement: true,
      primaryKey: true
    },
    status: {
      type: DataTypes.STRING
    }
  });
};
