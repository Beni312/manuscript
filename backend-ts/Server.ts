import * as express from "express";
import * as bodyParser from "body-parser";
import * as http from "http";
import * as cookieParser from "cookie-parser";
import * as passport from "passport";
import * as config from "./config/config";

import { Auth } from "./auth/auth";
import { InternalServerError } from "./error/InternalServerError";
import { Models } from "./model";
import { Roles } from "./auth/roles";
import { Router } from "./route";
import { sequelize } from "./sequelize.config";
import { errorHandler } from "./error/ErrorHandler";

export class Server {

    public static app: express.Express;

    // TODO Make all of this async
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

            // Initialize role based security
            Server.initializeRoles();

            // Initialize Routes
            Router.initializeRoutes(Server.app);

            Server.app.use(errorHandler);

            // Initialize Database then bootstrap application
            try {
                await Server.initializeDatabase();
            } catch (error) {
                // logger.error("Failed to initialize database", error);
                console.log(error);
            }

            return Server.app.listen(Server.app.get("port"));

        } catch (error) {
            throw new InternalServerError(error.message);
        }

    }

    private static async initializeDatabase() {
        const nodeEnv = process.env.NODE_ENV;
        if (nodeEnv) {
            const sequelizeConfig = config[nodeEnv];
            console.log(sequelizeConfig);
            const models = new Models(sequelizeConfig);
            return await models.initModels();
        } else {
            throw new InternalServerError("No NODE ENV set");
        }
    }

    private static initializeAuth() {
      Server.app.use(passport.initialize());
      Auth.serializeUser(sequelize);
      Auth.useLocalStrategy(sequelize);
    }

    private static initializeRoles() {
        Roles.buildRoles();
        Server.app.use(Roles.middleware());
    }

    private static configureApp() {
        // all environments
        Server.app.set("port", process.env.PORT || 3000);
        Server.app.use(bodyParser.urlencoded({extended: true}));
        Server.app.use(bodyParser.json());
        Server.app.use(cookieParser());
    }
}
