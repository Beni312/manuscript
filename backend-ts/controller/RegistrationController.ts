import * as express from "express";
import { BaseController } from "./BaseController";
import { BasicResponse } from "../model/dto/BasicResponse";
import { logger } from "../service/logger";
import { RegistrationService } from "../service/RegistrationService";

export class RegistrationController extends BaseController {

  registrationService: RegistrationService;

  constructor() {
    super();
    this.buildRoutes();
    this.registrationService = new RegistrationService();
  }

  async create(req: express.Request, res: express.Response, next: express.NextFunction) {
    const user = req.body;
    try {
      await this.registrationService.create(user);
    } catch(error) {
      logger.error(error);
      res.status(401);
      res.json(new BasicResponse().withExceptionMessage(error.message));
      return;
    }
    res.json({successMessage: 'User created'});
  }

  buildRoutes() {
    this.router.post("/create", this.create.bind(this));
  }

}
