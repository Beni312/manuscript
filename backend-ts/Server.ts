import * as bodyParser from 'body-parser';
import * as config from './config/config';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as http from 'http';
import * as passport from 'passport';
import * as session from 'express-session';

import 'reflect-metadata';
import './controller/AuthenticationController';
import './controller/ApplicationController';
import './controller/ProfileController';
import './controller/RegistrationController';
import './controller/SubmissionController';
import './controller/UserManagementController';

import { ApplicationService } from './service/ApplicationService';
import { Auth } from './auth/Auth';
import { Container } from 'inversify';
import { errorHandler } from './middleware/ErrorHandler';
import { InternalServerError } from './model/error/InternalServerError';
import { InversifyExpressServer } from 'inversify-express-utils';
import { logger } from './service/logger';
import { Models } from './model';
import { ProfileService } from './service/ProfileService';
import { RegistrationService } from './service/RegistrationService';
import { SubmissionService } from './service/SubmissionService';
import { UserManagementService } from './service/UserManagementService';

export class Server {

  public static inversifyServer: InversifyExpressServer;

  constructor() {
  }

  public static async initializeApp(): Promise<http.Server> {
    try {
      require('dotenv').config();
      await Server.initInversify();

      try {
        await Server.initializeDatabase();
      } catch (error) {
        logger.error('Failed to initialize database', error);
      }

      const app: express.Application = Server.inversifyServer.build();
      return app.listen(app.get('port'));

    } catch (error) {
      throw new InternalServerError(error.message);
    }
  }

  private static async initInversify() {
    const container = new Container();

    container.bind<ApplicationService>(ApplicationService.name).to(ApplicationService);
    container.bind<ProfileService>(ProfileService.name).to(ProfileService);
    container.bind<RegistrationService>(RegistrationService.name).to(RegistrationService);
    container.bind<SubmissionService>(SubmissionService.name).to(SubmissionService);
    container.bind<UserManagementService>(UserManagementService.name).to(UserManagementService);

    Server.inversifyServer = new InversifyExpressServer(container);
    Server.inversifyServer.setErrorConfig(app => app.use(errorHandler));
    Server.inversifyServer.setConfig((app: any) => {
      Server.initializeAuth();
      Server.configureApp(app);
    });
  }

  private static async initializeDatabase() {
    const nodeEnv = process.env.NODE_ENV;
    if (nodeEnv) {
      const sequelizeConfig = config[nodeEnv];
      const models = new Models(sequelizeConfig);
      await models.initModels();
    } else {
      throw new InternalServerError('No NODE ENV set');
    }
  }

  private static initializeAuth() {
    Auth.serializeUser();
    Auth.useLocalStrategy();
  }

  private static configureApp(app) {
    app.set('port', process.env.PORT || 3000);
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(session({
      secret: 'asdasdasdasd',
      resave: true,
      saveUninitialized: true
    }));
    app.use(passport.initialize());
    app.use(passport.session());
  }
}
