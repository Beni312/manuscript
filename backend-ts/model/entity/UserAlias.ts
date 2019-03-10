import { Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "./User";

@Table
export class UserAlias extends Model<UserAlias> {

  @PrimaryKey
  @Column(DataType.STRING)
  username: string;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId: number;
}
