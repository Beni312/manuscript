module.exports = function(sequelize, DataTypes) {
  return sequelize.define('submissionAcademicDiscipline', {
    submissionId: {
      type: DataTypes.INTEGER,
      references: {
        model: "submission",
        key: "id"
      }
    },
    academicDisciplineId: {
      type: DataTypes.INTEGER,
      references: {
        model: "academicDiscipline",
        key: "id"
      }
    }
  });
};
