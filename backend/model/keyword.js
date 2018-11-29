module.exports = function(sequelize, DataTypes) {
  return sequelize.define('keyword', {
    submissionId: {
      type: DataTypes.INTEGER,
      references: {
        model: "submission",
        key: "id"
      }
    },
    keyword: {
      type: DataTypes.STRING
    }
  });
};
