import { AutoIncrement, Column, DataType, PrimaryKey, Table } from "sequelize-typescript";
import { ModelRepository } from "../ModelRepository";
import { RoleEnum } from '../enum/RoleEnum';

@Table
export class Role extends ModelRepository<Role> {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.STRING)
  name: string;

  public static isAdmin(role): boolean {
    if (role == RoleEnum.ADMIN) {
      return true;
    }
    return false;
  }
}
