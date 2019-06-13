import * as express from 'express';
import { Auth } from '../auth/Auth';
import { AuthorDto } from '../model/dto/AuthorDto';
import { BasicResponse } from '../model/dto/BasicResponse';
import { controller, httpPost, interfaces } from 'inversify-express-utils';
import { inject } from 'inversify';
import { SubmissionPreload } from '../model/dto/SubmissionPreload';
import { SubmissionService } from '../service/SubmissionService';
import { UpsertSubmissionPreload } from '../model/dto/UpsertSubmissionPreload';

@controller('/submission', Auth.isAuthenticated)
export class SubmissionController implements interfaces.Controller {

  @inject(SubmissionService.name)
  private submissionService: SubmissionService;

  @httpPost('/create')
  async create(req: express.Request, res: express.Response, next: express.NextFunction): Promise<BasicResponse> {
    await this.submissionService.createSubmission(req.user.userId, req.body);
    return new BasicResponse()
      .withSuccessMessage('Submission created');
  }

  @httpPost('/getAuthors')
  async getAuthors(req: express.Request, res: express.Response, next: express.NextFunction): Promise<AuthorDto[]> {
    return await this.submissionService.getAuthors();
  }

  @httpPost('/preload')
  async preload(req: express.Request, res: express.Response, next: express.NextFunction): Promise<SubmissionPreload> {
    return await this.submissionService.preload(req.user, req.user.role);
  }

  @httpPost('/remove')
  async remove(req: express.Request, res: express.Response, next: express.NextFunction): Promise<BasicResponse> {
    this.submissionService.remove(req.body.submissionId);
    return new BasicResponse()
      .withSuccessMessage("Submission deleted");
  }

  @httpPost('/submit')
  async submit(req: express.Request, res: express.Response, next: express.NextFunction): Promise<BasicResponse> {
    const submissionId: string = req.body.submissionId;
    await this.submissionService.submitSubmission(submissionId);
    return new BasicResponse()
      .withSuccessMessage('Submission successfully submitted.');
  }

  @httpPost('/edit')
  async edit(req: express.Request, res: express.Response, next: express.NextFunction): Promise<BasicResponse> {
    await this.submissionService.editSubmission(req.body);
    return new BasicResponse()
      .withSuccessMessage('Successfully edited');
  }

  @httpPost('/evaluate')
  async evaluate(req: express.Request, res: express.Response, next: express.NextFunction): Promise<BasicResponse> {
    await this.submissionService.evaluateSubmission(req.body, req.user.userId, req.user.role);
    return new BasicResponse()
      .withSuccessMessage("Submission evaluated");
  }

  @httpPost('/upsertSubmissionPreload')
  async upsertSubmissionPreload(req: express.Request, res: express.Response, next: express.NextFunction): Promise<UpsertSubmissionPreload> {
    return await this.submissionService.getUpsertSubmissionPreload();
  }
}
