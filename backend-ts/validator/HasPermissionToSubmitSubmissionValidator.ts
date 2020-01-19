import * as express from 'express';
import { AuthProvider } from '../service/AuthProvider';
import { BaseValidator } from './BaseValidator';
import { inject, injectable } from 'inversify';
import { next, request, response } from 'inversify-express-utils';
import { PermissionError } from '../model/error/PermissionError';
import { Principal } from '../model/Principal';
import { Submission } from '../model';
import { SubmissionRepository } from '../repository/SubmissionRepository';
import { SubmissionSubmitCommand } from '../model/command/SubmissionSubmitCommand';

@injectable()
export class HasPermissionToSubmitSubmissionValidator extends BaseValidator {

  @inject(AuthProvider.name)
  authProvider: AuthProvider;

  @inject(SubmissionRepository.name)
  submissionRepository: SubmissionRepository;

  handler(@request() req: express.Request, @response() res: express.Response, @next() next: express.NextFunction): void {
    const submissionRemoveCommand: SubmissionSubmitCommand = req.body;
    const user: Principal = this.getPrincipal();
    this.submissionRepository._findByPk(submissionRemoveCommand.submissionId).then((submission: Submission) => {
      if (user.hasRole(['ADMIN']) || submission.submitterId === user.details.id) {
        next();
        return;
      }

      next(new PermissionError());
    });
  }
}
