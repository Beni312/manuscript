module.exports = function(sequelize, DataTypes) {
  return sequelize.define('author', {
    submissionId: {
      type: DataTypes.INTEGER,
      references: {
        model: "submission",
        key: "id"
      }
    },
    authorId: {
      type: DataTypes.INTEGER,
      references: {
        model: "user",
        key: "id"
      }
    }
  }, {
    unique_keys: {
      Author_unique: {
        fields: ["submissionId", "authorId"]
      }
    }
  });
};
