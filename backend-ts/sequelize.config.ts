import { Sequelize } from "sequelize-typescript";

export const sequelize = new Sequelize({
  name: 'manuscript',
  dialect: 'mysql',
  host: 'localhost',
  username: 'root',
  password: 'root1235',
  define: {
    timestamps: false,
    freezeTableName: true
  },
  modelPaths: [
    __dirname + '/model/entity'
  ]
});
