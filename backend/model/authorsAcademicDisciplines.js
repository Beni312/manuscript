module.exports = function(sequelize, DataTypes) {
  return sequelize.define('authorsAcademicDiscipline', {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "user",
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
