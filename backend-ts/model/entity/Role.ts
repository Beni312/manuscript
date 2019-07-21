import { AutoIncrement, Column, DataType, PrimaryKey, Table } from 'sequelize-typescript';
import { BaseModelTableOptions } from './BaseModelTableOptions';

@Table({
  modelName: 'role'
})
export class Role extends BaseModelTableOptions<Role> {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.STRING)
  name: string;
}
