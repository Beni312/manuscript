import * as express from "express";
import { AuthRouter } from "./AuthenticationRouter";

export class Router {

    public static initializeRoutes(app: express.Express) {
      app.use('/', new AuthRouter().router);
    }
}
