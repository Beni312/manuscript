import { AcademicDiscipline } from "../model/index";
import { injectable } from 'inversify';

@injectable()
export class ApplicationService {

  public async getAcademicDisciplines(): Promise<AcademicDiscipline[]> {
    return AcademicDiscipline.findAll();
  }
}
