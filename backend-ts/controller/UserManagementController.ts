import * as express from 'express';
import { BaseController } from './BaseController';
import { UserManagementDto } from '../model/dto/UserManagementDto';
import { UserManagementService } from '../service/UserManagementService';

export class UserManagementController extends BaseController {

  private userManagementService: UserManagementService;

  constructor() {
    super();
    this.buildRoutes();
    this.userManagementService = new UserManagementService();
  }

  async getUsers(req: express.Request, res: express.Response, next: express.NextFunction) {
    let users: UserManagementDto[];
    try {
      users = await this.userManagementService.getUsers();
      res.json(users);
    } catch (error) {
      console.log(error);
    }
  }

  buildRoutes() {
    this.router.post('/usermanagement', this.getUsers.bind(this));
  }
}
