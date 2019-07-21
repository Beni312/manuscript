import { AutoIncrement, Column, DataType, ForeignKey, PrimaryKey, Table } from 'sequelize-typescript';
import { BaseModelTableOptions } from './BaseModelTableOptions';
import { Submission } from './Submission';

@Table({
  modelName: 'keyword'
})
export class Keyword extends BaseModelTableOptions<Keyword> {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Submission)
  @Column({
    type: DataType.INTEGER,
    field: 'submission_id'
  })
  submissionId: number;

  @Column(DataType.STRING)
  keyword: string;
}
