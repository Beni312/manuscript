import * as bodyParser from 'body-parser';
import * as config from './config/config';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as http from 'http';
import * as passport from 'passport';
import * as session from 'express-session';
import { logger } from './service/logger';
import { errorHandler } from './middleware/ErrorHandler';

import 'reflect-metadata';
import './controller/AuthenticationController';
import './controller/ApplicationController';
import './controller/ConferenceController';
import './controller/ProfileController';
import './controller/RegistrationController';
import './controller/SubmissionController';
import './controller/UserManagementController';
import './controller/MessageController';
import './controller/ManuscriptController';

import { AcademicDisciplineRepository } from './repository/AcademicDisciplineRepository';
import { ApplicationService } from './service/ApplicationService';
import { AuthorsAcademicDisciplineRepository } from './repository/AuthorsAcademicDisciplineRepository';
import { Auth } from './auth/Auth';
import { AuthProvider } from './service/AuthProvider';
import { ChangePasswordValidator } from './validator/ChangePasswordValidator';
import { ConferenceRepository } from './repository/ConferenceRepository';
import { ConferenceService } from './service/ConferenceService';
import { Container } from 'inversify';
import { EditConferenceCommandValidator } from './validator/EditConferenceCommandValidator';
import { HasPermissionToDeleteSubmissionValidator } from './validator/HasPermissionToDeleteSubmissionValidator';
import { HasPermissionToSubmitSubmissionValidator } from './validator/HasPermissionToSubmitSubmissionValidator';
import { ImageResizer } from './service/ImageResizer';
import { InternalServerError } from './model/error/InternalServerError';
import { InversifyExpressServer } from 'inversify-express-utils';
import { KeywordRepository } from './repository/KeywordRepository';
import { ManuscriptService } from './service/ManuscriptService';
import { ManuscriptRepository } from './repository/ManuscriptRepository';
import { MessageService } from './service/MessageService';
import { MessageRepository } from './repository/MessageRepository';
import { Models } from './model';
import { RegistrationCommandValidator } from './validator/RegistrationCommandValidator';
import { PasswordRepository } from './repository/PasswordRepository';
import { PasswordService } from './service/PasswordService';
import { ProfileService } from './service/ProfileService';
import { RegistrationService } from './service/RegistrationService';
import { RoleRepository } from './repository/RoleRepository';
import { SubmissionCreateValidator } from './validator/SubmissionCreateValidator';
import { SubmissionRepository } from './repository/SubmissionRepository';
import { SubmissionService } from './service/SubmissionService';
import { SocketController } from "./controller/SocketController";
import { SocketServer } from "./SocketServer";
import { SocketService } from "./service/SocketService";
import { UserManagementService } from './service/UserManagementService';
import { UserRepository } from './repository/UserRepository';
import { UpdateAcademicDisciplinesValidator } from './validator/UpdateAcademicDisciplinesValidator';
import { UtilsService } from './service/UtilsService';
import { UserAliasRepository } from './repository/UserAliasRepository';
import { UserStatusRepository } from './repository/UserStatusRepository';

export class Server {

  public static inversifyServer: InversifyExpressServer;
  public static container: Container;

  constructor() {
  }

  public static async initializeApp(): Promise<http.Server> {
    try {
      require('dotenv').config();
      const container: Container = await Server.initInversify();

      try {
        await Server.initializeDatabase();
      } catch (error) {
        logger.error('Failed to initialize database', error);
      }

      const app: express.Application = Server.inversifyServer.build();
      const server = app.listen(app.get('port'));

      Server.initApplication(server, container);

      return server;

    } catch (error) {
      throw new InternalServerError(error.message);
    }
  }

  private static initApplication(app: http.Server, container: Container) {
    container.get<SocketServer>(SocketServer.name).init(app, container);
  }

  private static initInversify(): Container {
    Server.container = new Container();

    Server.container.bind<ApplicationService>(ApplicationService.name).to(ApplicationService);
    Server.container.bind<ProfileService>(ProfileService.name).to(ProfileService);
    Server.container.bind<RegistrationService>(RegistrationService.name).to(RegistrationService);
    Server.container.bind<SubmissionService>(SubmissionService.name).to(SubmissionService);
    Server.container.bind<UserManagementService>(UserManagementService.name).to(UserManagementService);
    Server.container.bind<AcademicDisciplineRepository>(AcademicDisciplineRepository.name).to(AcademicDisciplineRepository);
    Server.container.bind<AuthorsAcademicDisciplineRepository>(AuthorsAcademicDisciplineRepository.name).to(AuthorsAcademicDisciplineRepository);
    Server.container.bind<KeywordRepository>(KeywordRepository.name).to(KeywordRepository);
    Server.container.bind<PasswordRepository>(PasswordRepository.name).to(PasswordRepository);
    Server.container.bind<RoleRepository>(RoleRepository.name).to(RoleRepository);
    Server.container.bind<SubmissionRepository>(SubmissionRepository.name).to(SubmissionRepository);
    Server.container.bind<UserRepository>(UserRepository.name).to(UserRepository);
    Server.container.bind<ConferenceService>(ConferenceService.name).to(ConferenceService);
    Server.container.bind<ConferenceRepository>(ConferenceRepository.name).to(ConferenceRepository);
    Server.container.bind<UserStatusRepository>(UserStatusRepository.name).to(UserStatusRepository);
    Server.container.bind<UserAliasRepository>(UserAliasRepository.name).to(UserAliasRepository);

    Server.container.bind<AuthProvider>(AuthProvider.name).to(AuthProvider);
    Server.container.bind<PasswordService>(PasswordService.name).to(PasswordService);

    Server.container.bind<ImageResizer>(ImageResizer.name).to(ImageResizer);
    Server.container.bind<ManuscriptService>(ManuscriptService.name).to(ManuscriptService);
    Server.container.bind<ManuscriptRepository>(ManuscriptRepository.name).to(ManuscriptRepository);

    Server.container.bind<HasPermissionToDeleteSubmissionValidator>(HasPermissionToDeleteSubmissionValidator.name).to(HasPermissionToDeleteSubmissionValidator);
    Server.container.bind<HasPermissionToSubmitSubmissionValidator>(HasPermissionToSubmitSubmissionValidator.name).to(HasPermissionToSubmitSubmissionValidator);
    Server.container.bind<SubmissionCreateValidator>(SubmissionCreateValidator.name).to(SubmissionCreateValidator);
    Server.container.bind<UpdateAcademicDisciplinesValidator>(UpdateAcademicDisciplinesValidator.name).to(UpdateAcademicDisciplinesValidator);
    Server.container.bind<ChangePasswordValidator>(ChangePasswordValidator.name).to(ChangePasswordValidator);
    Server.container.bind<RegistrationCommandValidator>(RegistrationCommandValidator.name).to(RegistrationCommandValidator);
    Server.container.bind<EditConferenceCommandValidator>(EditConferenceCommandValidator.name).to(EditConferenceCommandValidator);

    Server.container.bind<MessageService>(MessageService.name).to(MessageService);
    Server.container.bind<MessageRepository>(MessageRepository.name).to(MessageRepository);
    Server.container.bind<UtilsService>(UtilsService.name).to(UtilsService);
    Server.container.bind<SocketServer>(SocketServer.name).to(SocketServer);
    Server.container.bind<SocketService>(SocketService.name).to(SocketService);
    Server.container.bind<SocketController>(SocketController.name).to(SocketController);

    Server.inversifyServer = new InversifyExpressServer(Server.container, null, null, null, AuthProvider);
    Server.inversifyServer.setErrorConfig(app => app.use(errorHandler));
    Server.inversifyServer.setConfig((app: any) => {
      Server.initializeAuth();
      Server.configureApp(app);
    });

    return Server.container;
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
