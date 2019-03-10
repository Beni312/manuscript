import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Submission } from "./Submission";
import { AcademicDiscipline } from "./AcademicDiscipline";

@Table
export class SubmissionAcademicDiscipline extends Model<SubmissionAcademicDiscipline> {

  @ForeignKey(() => Submission)
  @Column(DataType.INTEGER)
  submissionId: number;

  @ForeignKey(() => AcademicDiscipline)
  @Column(DataType.INTEGER)
  academicDisciplineId: number;
}
