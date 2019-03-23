import * as express from "express";
import { BaseController } from "./BaseController";
import { logger } from "../service/logger";
import { ProfileService } from "../service/ProfileService";

export class ProfileController extends BaseController {

  profileService: ProfileService;

  constructor() {
    super();
    this.buildRoutes();
    this.profileService = new ProfileService();
  }

  async preload(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      const preload = await this.profileService.getPreload(req.user.userId);
      res.json(preload);
    } catch(error) {
      logger.error(error);
    }
  }

  async save(req: express.Request, res: express.Response, next: express.NextFunction) {
    const user = req.body;
    await this.profileService.saveProfile(req.user.userId, user);
    res.json({successMessage: 'Your personal data has been updated successfully!'});
  }

  async changePassword(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      await this.profileService.changePassword(req.user.userId, req.body);
    } catch(error) {
      logger.error(error);
    }
    res.json({successMessage:"Your password has changed successfully!"});
  }

  async updateAcademicDisciplines(req: express.Request, res: express.Response, next: express.NextFunction) {
    await this.profileService.updateAcademicDisciplines(req.user.userId, req.body);
    res.json({
      successMessage: 'Your academic disciplines has changed successfully!'
    });
  }

  buildRoutes() {
    this.router.post("/preload", this.preload.bind(this));
    this.router.post("/updatedisciplines", this.updateAcademicDisciplines.bind(this));
    this.router.post("/savepersonaldata", this.save.bind(this));
    this.router.post("/changepassword", this.changePassword.bind(this));
  }
}
