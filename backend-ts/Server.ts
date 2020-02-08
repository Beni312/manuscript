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
import './controller/ConferenceController';
import './controller/ProfileController';
import './controller/RegistrationController';
import './controller/SubmissionController';
import './controller/UserManagementController';

import { AcademicDisciplineRepository } from './repository/AcademicDisciplineRepository';
import { ApplicationService } from './service/ApplicationService';
import { AuthorsAcademicDisciplineRepository } from './repository/AuthorsAcademicDisciplineRepository';
import { Auth } from './auth/Auth';
import { AuthProvider } from './service/AuthProvider';
import { ConferenceRepository } from './repository/ConferenceRepository';
import { ConferenceService } from './service/ConferenceService';
import { Container } from 'inversify';
import { errorHandler } from './middleware/ErrorHandler';
import { HasPermissionToDeleteSubmissionValidator } from './validator/HasPermissionToDeleteSubmissionValidator';
import { HasPermissionToSubmitSubmissionValidator } from './validator/HasPermissionToSubmitSubmissionValidator';
import { InternalServerError } from './model/error/InternalServerError';
import { InversifyExpressServer } from 'inversify-express-utils';
import { KeywordRepository } from './repository/KeywordRepository';
import { logger } from './service/logger';
import { Models } from './model';
import { PasswordRepository } from './repository/PasswordRepository';
import { ProfileService } from './service/ProfileService';
import { RegistrationService } from './service/RegistrationService';
import { RoleRepository } from './repository/RoleRepository';
import { SubmissionCreateValidator } from './validator/SubmissionCreateValidator';
import { SubmissionRepository } from './repository/SubmissionRepository';
import { SubmissionService } from './service/SubmissionService';
import { UserManagementService } from './service/UserManagementService';
import { UserRepository } from './repository/UserRepository';
import { UpdateAcademicDisciplinesValidator } from './validator/UpdateAcademicDisciplinesValidator';

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
    container.bind<AcademicDisciplineRepository>(AcademicDisciplineRepository.name).to(AcademicDisciplineRepository);
    container.bind<AuthorsAcademicDisciplineRepository>(AuthorsAcademicDisciplineRepository.name).to(AuthorsAcademicDisciplineRepository);
    container.bind<KeywordRepository>(KeywordRepository.name).to(KeywordRepository);
    container.bind<PasswordRepository>(PasswordRepository.name).to(PasswordRepository);
    container.bind<RoleRepository>(RoleRepository.name).to(RoleRepository);
    container.bind<SubmissionRepository>(SubmissionRepository.name).to(SubmissionRepository);
    container.bind<UserRepository>(UserRepository.name).to(UserRepository);
    container.bind<ConferenceService>(ConferenceService.name).to(ConferenceService);
    container.bind<ConferenceRepository>(ConferenceRepository.name).to(ConferenceRepository);

    container.bind<AuthProvider>(AuthProvider.name).to(AuthProvider);

    container.bind<HasPermissionToDeleteSubmissionValidator>(HasPermissionToDeleteSubmissionValidator.name).to(HasPermissionToDeleteSubmissionValidator);
    container.bind<HasPermissionToSubmitSubmissionValidator>(HasPermissionToSubmitSubmissionValidator.name).to(HasPermissionToSubmitSubmissionValidator);
    container.bind<SubmissionCreateValidator>(SubmissionCreateValidator.name).to(SubmissionCreateValidator);
    container.bind<UpdateAcademicDisciplinesValidator>(UpdateAcademicDisciplinesValidator.name).to(UpdateAcademicDisciplinesValidator);

    Server.inversifyServer = new InversifyExpressServer(container, null, null, null, AuthProvider);
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
    Auth.useJWTStrategy();
  }

  private static configureApp(app) {
    app.use(express.static('./resource/WEB-INF'));
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
