import * as express from 'express';
import { inject, injectable } from 'inversify';
import { next, request, response } from 'inversify-express-utils';
import { AuthProvider } from '../service/AuthProvider';
import { BaseValidator } from './BaseValidator';

@injectable()
export class SubmissionCreateValidator extends BaseValidator {

  @inject(AuthProvider.name)
  authProvider: AuthProvider;

  handler(@request() req: express.Request, @response() res: express.Response, @next() next: express.NextFunction): void {
  }
}
