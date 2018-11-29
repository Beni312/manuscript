module.exports = function(sequelize, DataTypes) {
  return sequelize.define('submission', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING
    },
    manuscriptAbstract: {
      type: DataTypes.STRING
    },
    submitter: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    conferenceId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'conference',
        key: 'id'
      }
    },
    lastModifyDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    creationDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });
};
