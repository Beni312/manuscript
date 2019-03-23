import { AutoIncrement, Column, DataType, PrimaryKey, Table } from "sequelize-typescript";
import { ModelRepository } from "../ModelRepository";

@Table
export class UserStatus extends ModelRepository<UserStatus> {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.STRING)
  status: string;
}
