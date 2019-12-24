import * as express from 'express';
import { AuthorDto } from '../model/dto/AuthorDto';
import { BasicResponse } from '../model/dto/BasicResponse';
import { controller, httpPost, interfaces, principal } from 'inversify-express-utils';
import { inject } from 'inversify';
import { JWTAuthentication } from '../middleware/JWTAuthentication';
import { Principal } from '../model/Principal';
import { SubmissionPreload } from '../model/dto/SubmissionPreload';
import { SubmissionService } from '../service/SubmissionService';
import { UpsertSubmissionPreload } from '../model/dto/UpsertSubmissionPreload';

@controller('/submission', JWTAuthentication())
export class SubmissionController implements interfaces.Controller {

  @inject(SubmissionService.name)
  private submissionService: SubmissionService;

  @httpPost('/getAuthors', JWTAuthentication())
  async getAuthors(): Promise<AuthorDto[]> {
    return await this.submissionService.getAuthors();
  }

  @httpPost('/preload', JWTAuthentication())
  async preload(@principal() userPrincipal: Principal): Promise<SubmissionPreload> {
    return await this.submissionService.preload(userPrincipal.details);
  }

  @httpPost('/remove', JWTAuthentication('AUTHOR', 'ADMIN'))
  async remove(req: express.Request): Promise<BasicResponse> {
    await this.submissionService.remove(req.body.submissionId);
    return new BasicResponse()
      .withSuccessMessage("Submission deleted");
  }

  @httpPost('/submit', JWTAuthentication('AUTHOR', 'ADMIN'))
  async submit(req: express.Request): Promise<BasicResponse> {
    const submissionId: number = req.body.submissionId;
    await this.submissionService.submitSubmission(submissionId);
    return new BasicResponse()
      .withSuccessMessage('Submission successfully submitted.');
  }

  @httpPost('/evaluate', JWTAuthentication('EDITOR', 'ADMIN', 'REVIEWER'))
  async evaluate(@principal() userPrincipal: Principal, req: express.Request): Promise<BasicResponse> {
    await this.submissionService.evaluateSubmission(req.body, userPrincipal.details.id, userPrincipal.details.role);
    return new BasicResponse()
      .withSuccessMessage("Submission evaluated");
  }

  @httpPost('/upsertSubmissionPreload', JWTAuthentication('AUTHOR', 'ADMIN'))
  async upsertSubmissionPreload(): Promise<UpsertSubmissionPreload> {
    return await this.submissionService.getUpsertSubmissionPreload();
  }

  @httpPost('/create', JWTAuthentication('AUTHOR', 'ADMIN'))
  async create(@principal() userPrincipal: Principal, req: express.Request): Promise<BasicResponse> {
    await this.submissionService.createSubmission(userPrincipal.details.id, req.body);
    return new BasicResponse()
      .withSuccessMessage('Submission created');
  }

  @httpPost('/edit', JWTAuthentication('AUTHOR', 'ADMIN'))
  async edit(req: express.Request): Promise<BasicResponse> {
    await this.submissionService.editSubmission(req.body);
    return new BasicResponse()
      .withSuccessMessage('Successfully edited');
  }
}
