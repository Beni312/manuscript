import * as express from "express";
import { ApplicationService } from "../service/ApplicationService";
import { AcademicDiscipline } from "../model/index";
import { BaseController } from "./BaseController";

export class ApplicationController extends BaseController {

  private applicationService: ApplicationService;

  constructor() {
    super();
    this.buildRoutes();
    this.applicationService = new ApplicationService();
  }

  async preload(req: express.Request, res: express.Response, next: express.NextFunction) {
    res.json({username: req.user.username, role: req.user.role});
  }

  async getAcademicDisciplines(req: express.Request, res: express.Response, next: express.NextFunction) {
    const academicDisciplines: AcademicDiscipline[] = await this.applicationService.getAcademicDisciplines();
    res.json(academicDisciplines);
  }

  buildRoutes() {
    this.router.post("/preload", this.preload.bind(this));
    this.router.post("/academicdisciplines", this.getAcademicDisciplines.bind(this));
  }
}
