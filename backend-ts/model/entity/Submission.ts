import { AcademicDiscipline } from './AcademicDiscipline';
import { AuthorsSubmission } from './AuthorsSubmission';
import { BaseModel } from './BaseModel';
import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Table } from 'sequelize-typescript';
import { Conference } from './Conference';
import { HasManySetAssociationsMixin } from 'sequelize';
import { Keyword } from './Keyword';
import { SubmissionStatus, submissionStatuses } from '../enum/SubmissionStatus';
import { SubmissionAcademicDiscipline } from './SubmissionAcademicDiscipline';
import { User } from './User';

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

  @Column(DataType.ENUM(submissionStatuses))
  status: SubmissionStatus;

  @BelongsToMany(() => AcademicDiscipline, () => SubmissionAcademicDiscipline)
  academicDisciplines: AcademicDiscipline[];

  @BelongsToMany(() => User, {through: () => AuthorsSubmission, as: 'authors', foreignKey: 'authorId', otherKey: 'submissionId'})
  authors: User[];

  @BelongsTo(() => User, {as: 'submitter'})
  submitter: User;

  @BelongsTo(() => Conference)
  conference: Conference;

  @HasMany(() => Keyword)
  keywords: Keyword[];

  public setAcademicDisciplines!: HasManySetAssociationsMixin<AcademicDiscipline, number>;

  public setAuthors!: HasManySetAssociationsMixin<User, number>;
}
