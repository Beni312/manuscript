module.exports = function(sequelize, DataTypes) {
  return sequelize.define('academicDiscipline', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING
    }
  });
};
