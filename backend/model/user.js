module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING
    },
    title: {
      type: DataTypes.STRING
    },
    firstName: {
      type: DataTypes.STRING
    },
    lastName: {
      type: DataTypes.STRING
    },
    job: {
      type: DataTypes.STRING
    },
    birthDate: {
      type: DataTypes.DATE
    },
    statusId: {
      type: DataTypes.TINYINT
    },
    roleId: {
      type: DataTypes.TINYINT,
      references: {
        model: 'role',
        key: 'id'
      }
    },
    creationDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });
};
