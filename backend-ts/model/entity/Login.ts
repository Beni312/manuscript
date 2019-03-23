import { Column, DataType, ForeignKey, Table } from "sequelize-typescript";
import { ModelRepository } from "../ModelRepository";
import { Password } from "./Password";
import { UserAlias } from "./UserAlias";

@Table
export class Login extends ModelRepository<Login> {

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
