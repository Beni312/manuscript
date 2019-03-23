import { AutoIncrement, Column, DataType, PrimaryKey, Table } from "sequelize-typescript";
import { ModelRepository } from "../ModelRepository";

@Table
export class AcademicDiscipline extends ModelRepository<AcademicDiscipline> {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.STRING)
  name: string;
}
