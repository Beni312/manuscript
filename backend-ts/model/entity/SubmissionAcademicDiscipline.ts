import { AcademicDiscipline } from './AcademicDiscipline';
import { BaseModelTableOptions } from './BaseModelTableOptions';
import { Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { Submission } from './Submission';

@Table({
  modelName: 'submission_academic_discipline'
})
export class SubmissionAcademicDiscipline extends BaseModelTableOptions<SubmissionAcademicDiscipline> {

  @ForeignKey(() => Submission)
  @Column({
    type: DataType.INTEGER,
    field: 'submission_id'
  })
  submissionId: number;

  @ForeignKey(() => AcademicDiscipline)
  @Column({
    type: DataType.INTEGER,
    field: 'academic_discipline_id'
  })
  academicDisciplineId: number;
}
