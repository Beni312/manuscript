import { AutoIncrement, Column, DataType, PrimaryKey, Table } from "sequelize-typescript";
import { ModelRepository } from "../ModelRepository";

@Table
export class Role extends ModelRepository<Role> {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.STRING)
  name: string;
}
