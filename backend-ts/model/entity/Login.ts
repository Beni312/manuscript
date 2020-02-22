import { BaseModel } from './BaseModel';
import { Column, DataType, Default, ForeignKey, Table } from 'sequelize-typescript';
import { Password } from './Password';
import { UserAlias } from './UserAlias';

@Table({
  modelName: 'login'
})
export class Login extends BaseModel<Login> {

  @ForeignKey(() => UserAlias)
  @Column(DataType.STRING)
  username: string;

  @ForeignKey(() => Password)
  @Column({
    type: DataType.INTEGER,
    field: 'password_id'
  })
  passwordId: number;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    field: 'failed_login_counter'
  })
  failedLoginCounter: number;

  @Default(true)
  @Column(DataType.BOOLEAN)
  enabled: boolean;
}
