import { AcademicDiscipline } from "../model/index";

export class ApplicationService {

  public async getAcademicDisciplines(): Promise<AcademicDiscipline[]> {
    return AcademicDiscipline.findAll();
  }
}
