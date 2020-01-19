import * as express from 'express';
import { AuthorDto } from '../model/dto/AuthorDto';
import { BasicResponse } from '../model/dto/BasicResponse';
import { BaseHttpController, controller, httpPost, interfaces, principal, requestBody } from 'inversify-express-utils';
import { HasPermissionToDeleteSubmissionValidator } from '../validator/HasPermissionToDeleteSubmissionValidator';
import { HasPermissionToSubmitSubmissionValidator } from '../validator/HasPermissionToSubmitSubmissionValidator';
import { inject } from 'inversify';
import { isAuthenticated } from '../decorator/IsAuthenticated';
import { Principal } from '../model/Principal';
import { SubmissionCreateCommand } from '../model/command/SubmissionCreateCommand';
import { SubmissionEvaluateCommand } from '../model/command/SubmissionEvaluateCommand';
import { SubmissionPreload } from '../model/dto/SubmissionPreload';
import { SubmissionRemoveCommand } from '../model/command/SubmissionRemoveCommand';
import { SubmissionService } from '../service/SubmissionService';
import { SubmissionSubmitCommand } from '../model/command/SubmissionSubmitCommand';
import { UpsertSubmissionPreload } from '../model/dto/UpsertSubmissionPreload';

@controller('/submission')
export class SubmissionController extends BaseHttpController implements interfaces.Controller {

  @inject(SubmissionService.name)
  private submissionService: SubmissionService;

  @isAuthenticated()
  @httpPost('/getAuthors')
  async getAuthors(): Promise<AuthorDto[]> {
    return await this.submissionService.getAuthors();
  }

  @isAuthenticated()
  @httpPost('/preload')
  async preload(@principal() userPrincipal: Principal): Promise<SubmissionPreload> {
    return await this.submissionService.preload(userPrincipal.details);
  }

  @isAuthenticated('AUTHOR', 'ADMIN')
  @httpPost('/remove', HasPermissionToDeleteSubmissionValidator.name)
  async remove(@principal() userPrincipal: Principal, @requestBody() submissionRemoveCommand: SubmissionRemoveCommand): Promise<BasicResponse> {
    await this.submissionService.remove(submissionRemoveCommand.submissionId);
    return new BasicResponse()
      .withSuccessMessage("Submission deleted");
  }

  @isAuthenticated('AUTHOR', 'ADMIN')
  @httpPost('/submit', HasPermissionToSubmitSubmissionValidator.name)
  async submit(@requestBody() submissionSubmitCommand: SubmissionSubmitCommand): Promise<BasicResponse> {
    await this.submissionService.submitSubmission(submissionSubmitCommand.submissionId);
    return new BasicResponse()
      .withSuccessMessage('Submission successfully submitted.');
  }

  @isAuthenticated('EDITOR', 'ADMIN', 'REVIEWER')
  @httpPost('/evaluate')
  async evaluate(@principal() userPrincipal: Principal, @requestBody() submissionEvaluateCommand: SubmissionEvaluateCommand): Promise<BasicResponse> {
    await this.submissionService.evaluateSubmission(submissionEvaluateCommand, userPrincipal.details.id, userPrincipal.details.role);
    return new BasicResponse()
      .withSuccessMessage("Submission evaluated");
  }

  @isAuthenticated('AUTHOR', 'ADMIN')
  @httpPost('/upsertSubmissionPreload')
  async upsertSubmissionPreload(): Promise<UpsertSubmissionPreload> {
    return await this.submissionService.getUpsertSubmissionPreload();
  }

  @isAuthenticated('AUTHOR', 'ADMIN')
  @httpPost('/create')
  async create(@principal() userPrincipal: Principal, @requestBody() submissionCreateCommand: SubmissionCreateCommand): Promise<BasicResponse> {
    await this.submissionService.createSubmission(userPrincipal.details.id, submissionCreateCommand);
    return new BasicResponse()
      .withSuccessMessage('Submission created');
  }

  @isAuthenticated('AUTHOR', 'ADMIN')
  @httpPost('/edit')
  async edit(req: express.Request): Promise<BasicResponse> {
    await this.submissionService.editSubmission(req.body);
    return new BasicResponse()
      .withSuccessMessage('Successfully edited');
  }
}
