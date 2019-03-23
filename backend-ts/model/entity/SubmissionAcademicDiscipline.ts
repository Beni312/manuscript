import { Column, DataType, ForeignKey, Table } from "sequelize-typescript";
import { AcademicDiscipline } from "./AcademicDiscipline";
import { ModelRepository } from "../ModelRepository";
import { Submission } from "./Submission";

@Table
export class SubmissionAcademicDiscipline extends ModelRepository<SubmissionAcademicDiscipline> {

  @ForeignKey(() => Submission)
  @Column(DataType.INTEGER)
  submissionId: number;

  @ForeignKey(() => AcademicDiscipline)
  @Column(DataType.INTEGER)
  academicDisciplineId: number;
}
