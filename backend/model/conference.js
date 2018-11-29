module.exports = function(sequelize, DataTypes) {
  return sequelize.define('conference', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    },
    submitter: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    creationDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });
};
