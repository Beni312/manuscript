import { AcademicDiscipline } from "./AcademicDiscipline";
import { Column, DataType, ForeignKey, PrimaryKey, Table } from "sequelize-typescript";
import { ModelRepository } from "..//ModelRepository";
import { User } from "./User";

@Table
export class AuthorsAcademicDiscipline extends ModelRepository<AuthorsAcademicDiscipline> {

  @PrimaryKey
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId: number;

  @PrimaryKey
  @ForeignKey(() => AcademicDiscipline)
  @Column(DataType.INTEGER)
  academicDisciplineId: number;
}
