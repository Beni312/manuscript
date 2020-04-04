import { BelongsTo, Column, CreatedAt, DataType, Default, ForeignKey, Table } from 'sequelize-typescript';
import { BaseModelTableOptions } from './BaseModelTableOptions';
import { User } from './User';

@Table({
  modelName: 'message'
})
export class Message extends BaseModelTableOptions<Message> {

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    field: 'user_id'
  })
  userId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    field: 'to'
  })
  to: number;

  @Column({
    type: DataType.STRING,
    field: 'message'
  })
  message: string;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    field: 'is_read'
  })
  isRead: boolean;

  @CreatedAt
  @Default(DataType.NOW)
  @Column({
    field: 'creation_date'
  })
  creationDate: Date;

  @BelongsTo(() => User, 'to')
  toUser: User;
}
