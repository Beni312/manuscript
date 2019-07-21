import { AutoIncrement, Column, CreatedAt, DataType, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import { BaseModelTableOptions } from './BaseModelTableOptions';

@Table
export class BaseModel<T> extends BaseModelTableOptions<T> {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @CreatedAt
  @Column({
    field: 'creation_date'
  })
  creationDate: Date;

  @UpdatedAt
  @Column({
    field: 'updated_on'
  })
  updatedOn: Date;
}
