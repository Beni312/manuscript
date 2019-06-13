import * as bodyParser from 'body-parser';
import * as config from './config/config';
import * as cookieParser from 'cookie-parser';
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
import { errorHandler } from './model/error/ErrorHandler';
import { InternalServerError } from './model/error/InternalServerError';
import { InversifyExpressServer } from 'inversify-express-utils';
import { logger } from './service/logger';
import { Models } from './model';
import { ProfileService } from './service/ProfileService';
import { RegistrationService } from './service/RegistrationService';
import { Roles } from './auth/Roles';
import { SubmissionService } from './service/SubmissionService';
import { UserManagementService } from './service/UserManagementService';

export class Server {

  public static server: InversifyExpressServer;

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

      const app = Server.server.build();
      return app.listen(3000);

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

    Server.server = new InversifyExpressServer(container);
    Server.server.setConfig((app: any) => {
      Server.initializeAuth(app);
      Server.configureApp(app);
      Server.initializeRoles(app);
      app.use(errorHandler);
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

  private static initializeAuth(app) {
    app.use(passport.initialize());
    app.use(passport.session());
    Auth.serializeUser();
    Auth.useLocalStrategy();
  }

  private static initializeRoles(app) {
    Roles.buildRoles();
    app.use(Roles.middleware());
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
