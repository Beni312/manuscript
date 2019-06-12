import * as express from 'express';
import { BaseController } from './BaseController';
import { BasicResponse } from '../model/dto/BasicResponse';
import { SubmissionService } from '../service/SubmissionService';

export class SubmissionController extends BaseController {

  private submissionService: SubmissionService;

  constructor() {
    super();
    this.buildRoutes();
    this.submissionService = new SubmissionService();
  }

  async create(req: express.Request, res: express.Response, next: express.NextFunction) {
    await this.submissionService.createSubmission(req.user.userId, req.body);
    res.json(new BasicResponse()
      .withSuccessMessage('Submission created')
    );
  }

  async getAuthors(req: express.Request, res: express.Response, next: express.NextFunction) {
    res.json(await this.submissionService.getAuthors());
  }

  async preload(req: express.Request, res: express.Response, next: express.NextFunction) {
    res.json(await this.submissionService.preload(req.user, req.user.role));
  }

  async remove(req: express.Request, res: express.Response, next: express.NextFunction) {
    this.submissionService.remove(req.body.submissionId);
    res.json(new BasicResponse()
      .withSuccessMessage("Submission deleted"));
  }
  
  async submit(req: express.Request, res: express.Response, next: express.NextFunction) {
    const submissionId: string = req.body.submissionId;
    await this.submissionService.submitSubmission(submissionId);
    res.json(new BasicResponse()
      .withSuccessMessage('Submission successfully submitted.')
    );
  }

  async edit(req: express.Request, res: express.Response, next: express.NextFunction) {
    await this.submissionService.editSubmission(req.body);
    res.json(new BasicResponse()
      .withSuccessMessage('Successfully edited')
    );
  }

  async evaluate(req: express.Request, res: express.Response, next: express.NextFunction) {
    await this.submissionService.evaluateSubmission(req.body, req.user.userId, req.user.role);
    res.json(new BasicResponse()
      .withSuccessMessage("Submission evaluated")
    );
  }

  async upsertSubmissionPreload(req: express.Request, res: express.Response, next: express.NextFunction) {
    res.json(await this.submissionService.getUpsertSubmissionPreload());
  }

  buildRoutes() {
    this.router.post("/preload", this.preload.bind(this));
    this.router.post("/remove", this.remove.bind(this));
    this.router.post("/getAuthors", this.getAuthors.bind(this));
    this.router.post("/submit", this.submit.bind(this));
    this.router.post("/edit", this.edit.bind(this));
    this.router.post("/evaluate", this.evaluate.bind(this));
    this.router.post("/create", this.create.bind(this));
    this.router.post("/upsertSubmissionPreload", this.upsertSubmissionPreload.bind(this));
  }
}
