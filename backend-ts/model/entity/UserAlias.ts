import { BaseModelTableOptions } from './BaseModelTableOptions';
import { Column, DataType, ForeignKey, PrimaryKey, Table } from 'sequelize-typescript';
import { User } from './User';

@Table({
  modelName: 'user_alias'
})
export class UserAlias extends BaseModelTableOptions<UserAlias> {

  @PrimaryKey
  @Column(DataType.STRING)
  username: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    field: 'user_id'
  })
  userId: number;
}
