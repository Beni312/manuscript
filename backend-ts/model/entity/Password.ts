import { BelongsTo, Column, DataType, ForeignKey, Table } from "sequelize-typescript";
import { BaseModel } from "./BaseModel";
import { User } from "./User";

@Table
export class Password extends BaseModel<Password> {

  @Column(DataType.STRING)
  password: string;

  @Column(DataType.DATE)
  expiryDate: Date;

  @Column(DataType.STRING)
  salt: string;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
