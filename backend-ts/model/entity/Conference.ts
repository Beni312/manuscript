import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Table } from 'sequelize-typescript';
import { AcademicDiscipline } from './AcademicDiscipline';
import { BaseModel } from './BaseModel';
import { ConferenceAcademicDiscipline } from './ConferenceAcademicDiscipline';
import { Submission } from './Submission';
import { User } from './User';

@Table({
  modelName: 'conference'
})
export class Conference extends BaseModel<Conference> {

  @Column(DataType.STRING)
  title: string;

  @Column(DataType.STRING)
  description: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    field: 'submitter_id'
  })
  submitterId: number;

  @BelongsTo(() => User)
  submitter: User;

  @HasMany(() => Submission)
  submissions: Submission[];

  @BelongsToMany(() => AcademicDiscipline, () => ConferenceAcademicDiscipline)
  academicDisciplines: AcademicDiscipline[];
}
