import { BaseModel } from './BaseModel';
import { DataType, ForeignKey, Column, Table } from 'sequelize-typescript';
import { MessageType, MessageTypeEnumerator } from '../enum/MessageType';
import { Submission } from './Submission';
import { User } from './User';

@Table({
  modelName: 'submission_message'
})
export class SubmissionMessage extends BaseModel<SubmissionMessage> {

  @Column(DataType.STRING)
  message: string;

  @Column(DataType.ENUM(new MessageTypeEnumerator()))
  type: MessageType;

  @ForeignKey(() => Submission)
  @Column({
    type: DataType.INTEGER,
    field: 'submission_id'
  })
  submissionId: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  sender: number;
}
