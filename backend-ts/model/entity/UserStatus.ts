import { AutoIncrement, Column, DataType, PrimaryKey, Table } from 'sequelize-typescript';
import { BaseModelTableOptions } from './BaseModelTableOptions';

@Table({
  modelName: 'user_status'
})
export class UserStatus extends BaseModelTableOptions<UserStatus> {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.STRING)
  status: string;
}
