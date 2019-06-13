import * as express from 'express';
import { AcademicDiscipline } from '../model/index';
import { ApplicationService } from '../service/ApplicationService';
import { Auth } from '../auth/Auth';
import { controller, httpPost, interfaces } from 'inversify-express-utils';
import { inject } from 'inversify';

@controller('/application')
export class ApplicationController implements interfaces.Controller{

  @inject(ApplicationService.name)
  private applicationService: ApplicationService;

  @httpPost('/preload', Auth.isAuthenticated)
  async preload(req: express.Request, res: express.Response, next: express.NextFunction) {
    res.json({username: req.user.username, role: req.user.role});
  }

  @httpPost('/academicdisciplines')
  async getAcademicDisciplines(req: express.Request, res: express.Response, next: express.NextFunction): Promise<AcademicDiscipline[]> {
    return await this.applicationService.getAcademicDisciplines();
  }
}
