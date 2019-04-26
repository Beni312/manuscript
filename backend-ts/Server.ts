import * as express from "express";
import * as bodyParser from "body-parser";
import * as http from "http";
import * as cookieParser from "cookie-parser";
import * as passport from "passport";
import * as config from "./config/config";
import * as session from "express-session";

import { Auth } from './auth/Auth';
import { errorHandler } from "./model/error/ErrorHandler";
import { InternalServerError } from "./model/error/InternalServerError";
import { logger } from "./service/logger";
import { Models } from "./model";
import { Roles } from "./auth/Roles";
import { Router } from "./route";
import { sequelize } from "./sequelize.config";

export class Server {

  public static app: express.Express;

  constructor() {
  }

  public static async initializeApp(): Promise<http.Server> {
    try {
      require('dotenv').config();
      Server.app = express();

      // Configure application
      Server.configureApp();

      // Initialize Auth
      Server.initializeAuth();


      // Initialize Database then bootstrap application
      try {
        await Server.initializeDatabase();
      } catch (error) {
        logger.error("Failed to initialize database", error);
        console.log(error);
      }

      // Configure application
      Server.configureApp();

      // Initialize role based security
      Server.initializeRoles();

      Server.app.use(errorHandler);

      // Initialize Routes
      Router.initializeRoutes(Server.app);

      return Server.app.listen(Server.app.get("port"));

    } catch (error) {
      throw new InternalServerError(error.message);
    }
  }

  private static async initializeDatabase() {
    const nodeEnv = process.env.NODE_ENV;
    if (nodeEnv) {
      const sequelizeConfig = config[nodeEnv];
      const models = new Models(sequelizeConfig);
      await models.initModels();
    } else {
      throw new InternalServerError("No NODE ENV set");
    }
  }

  private static initializeAuth() {
    Server.app.use(passport.initialize());
    Server.app.use(passport.session());
    Auth.serializeUser(sequelize);
    Auth.useLocalStrategy(sequelize);
  }

  private static initializeRoles() {
    Roles.buildRoles();
    Server.app.use(Roles.middleware());
  }

  private static configureApp() {
    Server.app.set("port", process.env.PORT || 3000);
    Server.app.use(bodyParser.urlencoded({extended: true}));
    Server.app.use(bodyParser.json());
    Server.app.use(cookieParser());
    Server.app.use(session({
      secret: "asdasdasdasd"
    }));
    Server.app.use(passport.initialize());
    Server.app.use(passport.session());
  }
}
