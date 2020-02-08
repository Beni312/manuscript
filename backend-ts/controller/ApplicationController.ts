import { AcademicDiscipline } from '../model';
import { ApplicationService } from '../service/ApplicationService';
import { controller, httpPost, interfaces } from 'inversify-express-utils';
import { inject } from 'inversify';

@controller('/application')
export class ApplicationController implements interfaces.Controller {

  @inject(ApplicationService.name)
  private applicationService: ApplicationService;

  @httpPost('/academic-disciplines')
  async getAcademicDisciplines(): Promise<AcademicDiscipline[]> {
    return await this.applicationService.getAcademicDisciplines();
  }
}
