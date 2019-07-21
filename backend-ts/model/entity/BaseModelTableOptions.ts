import { Model, Table } from 'sequelize-typescript';

@Table({
  freezeTableName: true
})
export class BaseModelTableOptions<T> extends Model<T> {
}
