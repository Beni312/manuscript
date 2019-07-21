import { BaseModel } from './BaseModel';
import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { User } from './User';

@Table({
  modelName: 'password'
})
export class Password extends BaseModel<Password> {

  @Column(DataType.STRING)
  password: string;

  @Column({
    type: DataType.DATE,
    field: 'expiry_date'
  })
  expiryDate: Date;

  @Column(DataType.STRING)
  salt: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    field: 'user_id'
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
