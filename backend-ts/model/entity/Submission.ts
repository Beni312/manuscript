import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Table } from "sequelize-typescript";
import { AcademicDiscipline } from "./AcademicDiscipline";
import { AuthorsSubmission } from "./AuthorsSubmission";
import { BaseModel } from "./BaseModel";
import { Conference } from "./Conference";
import { Keyword } from "./Keyword";
import { SubmissionAcademicDiscipline } from "./SubmissionAcademicDiscipline";
import { User } from "./User";

@Table
export class Submission extends BaseModel<Submission> {

  @Column(DataType.STRING)
  title: string;

  @Column(DataType.STRING)
  manuscriptAbstract: string;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  submitterId: number;

  @ForeignKey(() => Conference)
  @Column(DataType.INTEGER)
  conferenceId: number;

  @BelongsToMany(() => AcademicDiscipline, () => SubmissionAcademicDiscipline)
  academicDisciplines: AcademicDiscipline[];

  @BelongsToMany(() => User, () => AuthorsSubmission)
  authors: User[];

  @BelongsTo(() => Conference)
  conference: Conference;

  @BelongsTo(() => User)
  submitter: User;

  @HasMany(() => Keyword)
  keyword: Keyword[];
}
