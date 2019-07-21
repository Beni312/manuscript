import { AcademicDiscipline } from './AcademicDiscipline';
import { BaseModelTableOptions } from './BaseModelTableOptions';
import { Column, DataType, ForeignKey, PrimaryKey, Table } from 'sequelize-typescript';
import { User } from './User';

@Table({
  modelName: 'authors_academic_discipline'
})
export class AuthorsAcademicDiscipline extends BaseModelTableOptions<AuthorsAcademicDiscipline> {

  @PrimaryKey
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    field: 'user_id'
  })
  userId: number;

  @PrimaryKey
  @ForeignKey(() => AcademicDiscipline)
  @Column({
    type: DataType.INTEGER,
    field: 'academic_discipline_id'
  })
  academicDisciplineId: number;
}
