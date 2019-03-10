import { AcademicDiscipline } from "./AcademicDiscipline";
import { Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "./User";

@Table
export class AuthorsAcademicDiscipline extends Model<AuthorsAcademicDiscipline> {

  @PrimaryKey
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId: number;

  @PrimaryKey
  @ForeignKey(() => AcademicDiscipline)
  @Column(DataType.INTEGER)
  academicDisciplineId: number;
}
