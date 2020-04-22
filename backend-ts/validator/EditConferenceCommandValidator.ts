import * as express from 'express';
import { inject, injectable } from 'inversify';
import { request, response, next } from 'inversify-express-utils';
import { BaseValidator } from './BaseValidator';
import { ConferenceRepository } from '../repository/ConferenceRepository';
import { EditConferenceCommand } from '../model/command/EditConferenceCommand';
import { PermissionError } from '../model/error/PermissionError';

@injectable()
export class EditConferenceCommandValidator extends BaseValidator {

  @inject(ConferenceRepository.name)
  private conferenceRepository: ConferenceRepository;

  handler(@request() req: express.Request, @response() res: express.Response, @next() next: express.NextFunction): void {
    const command: EditConferenceCommand = req.body;
    this.conferenceRepository._findByPk(command.conferenceId)
      .then((conference) => {
        const user = this.getPrincipal().details;
        if (conference.submitterId !== user.id || user.role !== 'ADMIN') {
          return next(new PermissionError())
        }
        next();
      })
      .catch(error => {
        next(error);
      })
  }
}
