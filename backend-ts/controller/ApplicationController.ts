import * as express from 'express';
import { AcademicDiscipline } from '../model';
import { ApplicationService } from '../service/ApplicationService';
import { authorize } from '../middleware/Authorize';
import { controller, httpPost, interfaces } from 'inversify-express-utils';
import { inject } from 'inversify';
import { PreloadDto } from '../model/dto/PreloadDto';

@controller('/application')
export class ApplicationController implements interfaces.Controller{

  @inject(ApplicationService.name)
  private applicationService: ApplicationService;

  @httpPost('/preload', authorize())
  async preload(req: express.Request) {
    return new PreloadDto(req.user.username, req.user.role);
  }

  @httpPost('/academicdisciplines')
  async getAcademicDisciplines(): Promise<AcademicDiscipline[]> {
    return await this.applicationService.getAcademicDisciplines();
  }
}
