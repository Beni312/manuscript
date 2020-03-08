import { AcademicDiscipline } from './AcademicDiscipline';
import { BaseModelTableOptions } from './BaseModelTableOptions';
import { Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { Conference } from './Conference';

@Table({
  modelName: 'conference_academic_discipline'
})
export class ConferenceAcademicDiscipline extends BaseModelTableOptions<ConferenceAcademicDiscipline> {

  @ForeignKey(() => Conference)
  @Column({
    type: DataType.INTEGER,
    field: 'conference_id'
  })
  conferenceId: number;

  @ForeignKey(() => AcademicDiscipline)
  @Column({
    type: DataType.INTEGER,
    field: 'academic_discipline_id'
  })
  academicDisciplineId: number;
}
