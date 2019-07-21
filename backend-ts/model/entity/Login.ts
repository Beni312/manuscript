import { BaseModelTableOptions } from './BaseModelTableOptions';
import { Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { Password } from './Password';
import { UserAlias } from './UserAlias';

@Table({
  modelName: 'login'
})
export class Login extends BaseModelTableOptions<Login> {

  @ForeignKey(() => UserAlias)
  @Column(DataType.STRING)
  username: string;

  @ForeignKey(() => Password)
  @Column({
    type: DataType.INTEGER,
    field: 'password_id'
  })
  passwordId: number;

  @Column({
    type: DataType.INTEGER,
    field: 'failed_login_counter'
  })
  failedLoginCounter: number;

  @Column(DataType.BOOLEAN)
  enabled: boolean;
}
