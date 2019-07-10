import * as express from 'express';
import { AuthorDto } from '../model/dto/AuthorDto';
import { authorize } from '../middleware/Authorize';
import { BasicResponse } from '../model/dto/BasicResponse';
import { controller, httpPost, interfaces } from 'inversify-express-utils';
import { inject } from 'inversify';
import { SubmissionPreload } from '../model/dto/SubmissionPreload';
import { SubmissionService } from '../service/SubmissionService';
import { UpsertSubmissionPreload } from '../model/dto/UpsertSubmissionPreload';

@controller('/submission', authorize())
export class SubmissionController implements interfaces.Controller {

  @inject(SubmissionService.name)
  private submissionService: SubmissionService;

  @httpPost('/getAuthors', authorize())
  async getAuthors(): Promise<AuthorDto[]> {
    return await this.submissionService.getAuthors();
  }

  @httpPost('/preload')
  async preload(req: express.Request): Promise<SubmissionPreload> {
    return await this.submissionService.preload(req.user, req.user.role);
  }

  @httpPost('/remove', authorize('AUTHOR', 'ADMIN'))
  async remove(req: express.Request): Promise<BasicResponse> {
    this.submissionService.remove(req.body.submissionId);
    return new BasicResponse()
      .withSuccessMessage("Submission deleted");
  }

  @httpPost('/submit', authorize('AUTHOR', 'ADMIN'))
  async submit(req: express.Request): Promise<BasicResponse> {
    const submissionId: string = req.body.submissionId;
    await this.submissionService.submitSubmission(submissionId);
    return new BasicResponse()
      .withSuccessMessage('Submission successfully submitted.');
  }

  @httpPost('/evaluate', authorize('AUTHOR', 'ADMIN'))
  async evaluate(req: express.Request): Promise<BasicResponse> {
    await this.submissionService.evaluateSubmission(req.body, req.user.id, req.user.role);
    return new BasicResponse()
      .withSuccessMessage("Submission evaluated");
  }

  @httpPost('/upsertSubmissionPreload', authorize('AUTHOR', 'ADMIN'))
  async upsertSubmissionPreload(): Promise<UpsertSubmissionPreload> {
    return await this.submissionService.getUpsertSubmissionPreload();
  }

  @httpPost('/create', authorize('AUTHOR', 'ADMIN'))
  async create(req: express.Request): Promise<BasicResponse> {
    await this.submissionService.createSubmission(req.user.id, req.body);
    return new BasicResponse()
      .withSuccessMessage('Submission created');
  }

  @httpPost('/edit', authorize('AUTHOR', 'ADMIN'))
  async edit(req: express.Request): Promise<BasicResponse> {
    await this.submissionService.editSubmission(req.body);
    return new BasicResponse()
      .withSuccessMessage('Successfully edited');
  }
}
