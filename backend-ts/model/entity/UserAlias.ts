import { Column, DataType, ForeignKey, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "./User";
import { ModelRepository } from "../ModelRepository";

@Table
export class UserAlias extends ModelRepository<UserAlias> {

  @PrimaryKey
  @Column(DataType.STRING)
  username: string;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId: number;
}
