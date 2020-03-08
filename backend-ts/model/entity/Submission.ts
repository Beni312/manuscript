import { AcademicDiscipline } from './AcademicDiscipline';
import { BaseModel } from './BaseModel';
import { BelongsTo, BelongsToMany, Column, DataType, Default, ForeignKey, HasMany, Table } from 'sequelize-typescript';
import { Conference } from './Conference';
import { HasManySetAssociationsMixin } from 'sequelize';
import { Keyword } from './Keyword';
import { SubmissionAcademicDiscipline } from './SubmissionAcademicDiscipline';
import { SubmissionStatus, SubmissionStatusEnumerator } from '../enum/SubmissionStatus';
import { User } from './User';

@Table({
  modelName: 'submission'
})
export class Submission extends BaseModel<Submission> {

  @Column(DataType.STRING)
  title: string;

  @Column({
    type: DataType.STRING,
    field: 'manuscript_abstract'
  })
  manuscriptAbstract: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    field: 'submitter_id'
  })
  submitterId: number;

  @ForeignKey(() => Conference)
  @Column({
    type: DataType.INTEGER,
    field: 'conference_id'
  })
  conferenceId: number;

  @Default(SubmissionStatus.CREATED)
  @Column(DataType.ENUM(new SubmissionStatusEnumerator()))
  status: SubmissionStatus;

  @BelongsToMany(() => AcademicDiscipline, () => SubmissionAcademicDiscipline)
  academicDisciplines: AcademicDiscipline[];

  @BelongsTo(() => User)
  submitter: User;

  @BelongsTo(() => Conference)
  conference: Conference;

  @HasMany(() => Keyword)
  keywords: Keyword[];

  public setAcademicDisciplines!: HasManySetAssociationsMixin<AcademicDiscipline, number>;
}
