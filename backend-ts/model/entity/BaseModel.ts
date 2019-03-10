import { AutoIncrement, Column, CreatedAt, DataType, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';

@Table
export class BaseModel<T extends Model<T>> extends Model<T> {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @CreatedAt
    creationDate: Date;

    @UpdatedAt
    updatedOn: Date;
}
