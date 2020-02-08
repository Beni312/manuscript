import { AcademicDiscipline } from '../model';
import { injectable } from 'inversify';
import { Repository } from './Repository';

@injectable()
export class AcademicDisciplineRepository extends Repository<AcademicDiscipline> {

  constructor() {
    super(AcademicDiscipline);
  }

  findAcademicDisciplinesByIds(academicDisciplines: number[]): Promise<Array<AcademicDiscipline>> {
    return this.findAll({
      where: {
        id: academicDisciplines
      }
    });
  }

}
