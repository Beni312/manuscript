import * as express from 'express';
import { AuthenticationController } from '../controller/AuthenticationController';
import { ApplicationController } from '../controller/ApplicationController';
import { ProfileController } from '../controller/ProfileController';
import { SubmissionController } from '../controller/SubmissionController';
import { RegistrationController } from '../controller/RegistrationController';
import { UserManagementController } from '../controller/UserManagementController';

export class Router {

  public static initializeRoutes(app: express.Application) {
    app.use('/', new AuthenticationController().router);
    app.use('/registration', new RegistrationController().router);
    app.use('/application', new ApplicationController().router);
    app.use('/personaldatasettings', new ProfileController().router);
    app.use('/submission', new SubmissionController().router);
    app.use('/admin', new UserManagementController().router);
  }
}
