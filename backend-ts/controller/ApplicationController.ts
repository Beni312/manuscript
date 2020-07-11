import { controller, httpGet, httpPost, interfaces } from 'inversify-express-utils';
import { inject } from 'inversify';
import { AcademicDiscipline } from '../model';
import { ApplicationService } from '../service/ApplicationService';
import { SystemDataDto } from '../model/response/SystemDataDto';

@controller('/application')
export class ApplicationController implements interfaces.Controller {

  @inject(ApplicationService.name)
  private applicationService: ApplicationService;

  @httpPost('/academic-disciplines')
  async getAcademicDisciplines(): Promise<AcademicDiscipline[]> {
    return await this.applicationService.getAcademicDisciplines();
  }

  @httpGet('/system-data')
  async getSystemData(): Promise<SystemDataDto> {
    return this.applicationService.getSystemData();
  }
}
