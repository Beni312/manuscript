import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Password } from "./Password";
import { UserAlias } from "./UserAlias";

@Table
export class Login extends Model<Login> {

  @ForeignKey(() => UserAlias)
  @Column(DataType.STRING)
  username: string;

  @ForeignKey(() => Password)
  @Column(DataType.INTEGER)
  passwordId: number;

  @Column(DataType.INTEGER)
  failedLoginCounter: number;

  @Column(DataType.BOOLEAN)
  enabled: boolean;
}
