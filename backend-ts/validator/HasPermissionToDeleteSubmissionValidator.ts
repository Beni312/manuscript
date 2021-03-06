import * as express from 'express';
import { inject, injectable } from 'inversify';
import { next, request, response } from 'inversify-express-utils';
import { AuthProvider } from '../service/AuthProvider';
import { BaseValidator } from './BaseValidator';
import { PermissionError } from '../model/error/PermissionError';
import { Principal } from '../model/Principal';
import { RoleEnum } from '../model/enum/RoleEnum';
import { SubmissionRepository } from '../repository/SubmissionRepository';
import { Submission, User } from '../model';
import { SubmissionRemoveCommand } from '../model/command/SubmissionRemoveCommand';

@injectable()
export class HasPermissionToDeleteSubmissionValidator extends BaseValidator {

  @inject(AuthProvider.name)
  authProvider: AuthProvider;

  @inject(SubmissionRepository.name)
  submissionRepository: SubmissionRepository;

  handler(@request() req: express.Request, @response() res: express.Response, @next() next: express.NextFunction): void {
    const submissionRemoveCommand: SubmissionRemoveCommand = req.body;
    const user: Principal = this.getPrincipal();
    this.submissionRepository._findByPk(submissionRemoveCommand.submissionId, {include: [{model: User, as: 'submitter'}]}).then((submission: Submission) => {
          if (user.hasRole([RoleEnum.ADMIN])) {
            next();
            return;
          }

          if (submission.submitter.id === user.details.id) {
            next();
            return;
          }
          next(new PermissionError());
    });
  }
}
