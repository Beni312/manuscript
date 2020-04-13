import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { BaseModel } from './BaseModel';
import { Submission } from './Submission';
import { User } from './User';

@Table({
  modelName: 'manuscript'
})
export class Manuscript extends BaseModel<Manuscript> {

  @Column(DataType.INTEGER)
  version: number;

  @Column(DataType.STRING)
  filename: string;

  @ForeignKey(() => Submission)
  @Column({
    type: DataType.INTEGER,
    field: 'submission_id'
  })
  submissionId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    field: 'user_id'
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Submission)
  submission: Submission;
}
