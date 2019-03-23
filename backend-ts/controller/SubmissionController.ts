import * as express from "express";
import { BaseController } from "./BaseController";
import { BasicResponse } from "../model/dto/BasicResponse";
import { SubmissionService } from "../service/SubmissionService";

export class SubmissionController extends BaseController {

  private submissionService: SubmissionService;

  constructor() {
    super();
    this.buildRoutes();
    this.submissionService = new SubmissionService();
  }

  async preload(req: express.Request, res: express.Response, next: express.NextFunction) {
    res.json(await this.submissionService.preload(req.user.userId, req.user.role));
  }

  async remove(req: express.Request, res: express.Response, next: express.NextFunction) {
    this.submissionService.remove(req.body.submissionId);
    res.json(new BasicResponse()
      .withSuccessMessage("Submission deleted"));
  }

  buildRoutes() {
    this.router.post("/preload", this.preload.bind(this));
    this.router.post("/remove", this.remove.bind(this));
  }
}
