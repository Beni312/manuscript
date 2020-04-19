import { AcademicDiscipline } from '../model';
import { AcademicDisciplineRepository } from '../repository/AcademicDisciplineRepository';
import { inject, injectable } from 'inversify';

@injectable()
export class ApplicationService {

  @inject(AcademicDisciplineRepository.name)
  private academicDisciplineRepository: AcademicDisciplineRepository;

  public async getAcademicDisciplines(): Promise<AcademicDiscipline[]> {
    return await this.academicDisciplineRepository.findAll();
  }
}
