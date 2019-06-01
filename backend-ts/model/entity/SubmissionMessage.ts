import { BaseModel } from './BaseModel';
import { Column } from 'sequelize-typescript/lib/annotations/Column';
import { DataType, ForeignKey, Table } from 'sequelize-typescript';
import { MessageType, messageTypes } from '../enum/MessageType';
import { Submission } from './Submission';
import { User } from './User';

@Table
export class SubmissionMessage extends BaseModel<SubmissionMessage> {

  @Column(DataType.STRING)
  message: string;

  @Column(DataType.ENUM(messageTypes))
  type: MessageType;

  @ForeignKey(() => Submission)
  @Column(DataType.INTEGER)
  submissionId: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  sender: number;
}
