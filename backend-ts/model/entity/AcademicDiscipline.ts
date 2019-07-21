import { AutoIncrement, Column, DataType, PrimaryKey, Table } from 'sequelize-typescript';
import { BaseModelTableOptions } from './BaseModelTableOptions';

@Table({
  modelName: 'academic_discipline'
})
export class AcademicDiscipline extends BaseModelTableOptions<AcademicDiscipline> {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.STRING)
  name: string;
}
