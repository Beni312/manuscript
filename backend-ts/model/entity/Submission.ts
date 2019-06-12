import { AcademicDiscipline } from './AcademicDiscipline';
import { AuthorsSubmission } from './AuthorsSubmission';
import { BaseModel } from './BaseModel';
import { BelongsTo, BelongsToMany, Column, DataType, Default, ForeignKey, HasMany, Table } from 'sequelize-typescript';
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

  @Default(SubmissionStatus.CREATED)
  @Column(DataType.ENUM(submissionStatuses))
  status: SubmissionStatus;

  @BelongsToMany(() => AcademicDiscipline, () => SubmissionAcademicDiscipline)
  academicDisciplines: AcademicDiscipline[];

  @BelongsToMany(() => User, {through: () => AuthorsSubmission, as: 'authors', foreignKey: 'submissionId', otherKey: 'authorId'})
  authors: User[];

  @BelongsTo(() => User, {as: 'submitter'})
  submitter: User;

  @BelongsTo(() => Conference)
  conference: Conference;

  @HasMany(() => Keyword)
  keywords: Keyword[];

  @HasMany(() => AuthorsSubmission, {as: 'authorsSubmission'})
  authorsSubmission: AuthorsSubmission[];

  public setAcademicDisciplines!: HasManySetAssociationsMixin<AcademicDiscipline, number>;

  public setAuthors!: HasManySetAssociationsMixin<User, number>;
}
