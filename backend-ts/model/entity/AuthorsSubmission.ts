import { BaseModelTableOptions } from './BaseModelTableOptions';
import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { Submission } from './Submission';
import { User } from './User';

@Table({
  modelName: 'authors_submission'
})
export class AuthorsSubmission extends BaseModelTableOptions<AuthorsSubmission> {

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    field: 'author_id'
  })
  authorId: number;

  @ForeignKey(() => Submission)
  @Column({
    type: DataType.INTEGER,
    field: 'submission_id'
  })
  submissionId: number;

  @BelongsTo(() => User)
  author: User;
}
