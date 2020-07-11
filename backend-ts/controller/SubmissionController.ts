import * as express from 'express';
import { controller, httpGet, httpPost, principal, request, requestBody } from 'inversify-express-utils';
import { inject } from 'inversify';
import { isAuthenticated } from '../decorator/IsAuthenticated';
import { validateBody } from '../decorator/ValidateBody';
import { upload } from '../middleware/upload';
import { BasicResponse } from '../model/response/BasicResponse';
import { EditSubmissionDto } from '../model/response/EditSubmissionDto';
import { HasPermissionToDeleteSubmissionValidator } from '../validator/HasPermissionToDeleteSubmissionValidator';
import { HasPermissionToSubmitSubmissionValidator } from '../validator/HasPermissionToSubmitSubmissionValidator';
import { ManuscriptService } from '../service/ManuscriptService';
import { Principal } from '../model/Principal';
import { SubmissionCreateCommand } from '../model/command/SubmissionCreateCommand';
import { SubmissionEvaluateCommand } from '../model/command/SubmissionEvaluateCommand';
import { SubmissionPreload } from '../model/dto/SubmissionPreload';
import { SubmissionRemoveCommand } from '../model/command/SubmissionRemoveCommand';
import { SubmissionService } from '../service/SubmissionService';
import { SubmissionSubmitCommand } from '../model/command/SubmissionSubmitCommand';
import { PendingManuscriptDto } from '../model/dto/PendingManuscriptDto';
import { UpsertSubmissionPreload } from '../model/response/UpsertSubmissionPreload';

@controller('/submission')
export class SubmissionController {

  @inject(SubmissionService.name)
  private submissionService: SubmissionService;

  @inject(ManuscriptService.name)
  private manuscriptService: ManuscriptService;

  @isAuthenticated()
  @httpGet('/preload')
  async preload(@principal() userPrincipal: Principal): Promise<SubmissionPreload> {
    return await this.submissionService.preload(userPrincipal.details);
  }

  @isAuthenticated('AUTHOR', 'ADMIN')
  @httpPost('/remove', HasPermissionToDeleteSubmissionValidator.name)
  @validateBody(SubmissionRemoveCommand)
  async remove(@principal() userPrincipal: Principal, @requestBody() submissionRemoveCommand: SubmissionRemoveCommand): Promise<BasicResponse> {
    await this.submissionService.remove(submissionRemoveCommand.submissionId);
    return new BasicResponse()
      .withSuccessMessage("Submission deleted");
  }

  @isAuthenticated('AUTHOR', 'ADMIN')
  @httpPost('/submit', HasPermissionToSubmitSubmissionValidator.name)
  @validateBody(SubmissionSubmitCommand)
  async submit(@requestBody() submissionSubmitCommand: SubmissionSubmitCommand): Promise<BasicResponse> {
    await this.submissionService.submitSubmission(submissionSubmitCommand.submissionId);
    return new BasicResponse()
      .withSuccessMessage('Submission successfully submitted.');
  }

  @isAuthenticated('EDITOR', 'ADMIN', 'REVIEWER')
  @httpPost('/evaluate')
  @validateBody(SubmissionEvaluateCommand)
  async evaluate(@principal() userPrincipal: Principal, @requestBody() submissionEvaluateCommand: SubmissionEvaluateCommand): Promise<BasicResponse> {
    await this.submissionService.evaluateSubmission(submissionEvaluateCommand, userPrincipal.details.id, userPrincipal.details.role);
    return new BasicResponse()
      .withSuccessMessage("Submission evaluated");
  }

  @isAuthenticated('AUTHOR', 'ADMIN')
  @httpPost('/upsert-submission-preload')
  async upsertSubmissionPreload(): Promise<UpsertSubmissionPreload> {
    return await this.submissionService.getUpsertSubmissionPreload();
  }

  @isAuthenticated('AUTHOR', 'ADMIN')
  @httpPost('/create')
  @validateBody(SubmissionCreateCommand)
  async create(@principal() userPrincipal: Principal, @requestBody() submissionCreateCommand: SubmissionCreateCommand): Promise<BasicResponse> {
    await this.submissionService.createSubmission(userPrincipal.details.id, submissionCreateCommand);
    return new BasicResponse()
      .withSuccessMessage('Submission created');
  }

  @isAuthenticated('AUTHOR', 'ADMIN')
  @httpPost('/edit')
  @validateBody(EditSubmissionDto)
  async edit(@requestBody() editSubmissionDto: EditSubmissionDto): Promise<BasicResponse> {
    await this.submissionService.editSubmission(editSubmissionDto);
    return new BasicResponse()
      .withSuccessMessage('Successfully edited');
  }

  @isAuthenticated('AUTHOR')
  @httpPost('/upload-manuscript', upload.single('manuscript'))
  // @validateBody(UploadManuscriptDocumentToSubmissionCommand)
  async uploadManuscriptDocument(@request() req: express.Request, @principal() userPrincipal: Principal): Promise<PendingManuscriptDto> {
    return this.manuscriptService.saveAndCreateManuscript(userPrincipal.details.id, req.body.submissionId, req.file);
  }
}
