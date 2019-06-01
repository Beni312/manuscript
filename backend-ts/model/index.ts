import { AcademicDiscipline } from './entity/AcademicDiscipline';
import { AuthorsAcademicDiscipline } from './entity/AuthorsAcademicDiscipline';
import { AuthorsSubmission } from './entity/AuthorsSubmission';
import { Conference } from './entity/Conference';
import { InitialDatabaseUploadCommandService } from '../service/InitialDatabaseUploadCommandService';
import { Keyword } from './entity/Keyword';
import { Login } from './entity/Login';
import { Model, Sequelize } from 'sequelize-typescript';
import { Password } from './entity/Password';
import { Role } from './entity/Role';
import { Submission } from './entity/Submission';
import { SubmissionAcademicDiscipline } from './entity/SubmissionAcademicDiscipline';
import { SubmissionMessage } from './entity/SubmissionMessage';
import { TestData } from './test/test.data';
import { User } from './entity/User';
import { UserAlias } from './entity/UserAlias';
import { UserStatus } from './entity/UserStatus';

export { AcademicDiscipline } from './entity/AcademicDiscipline';
export { AuthorsAcademicDiscipline } from './entity/AuthorsAcademicDiscipline';
export { AuthorsSubmission } from './entity/AuthorsSubmission';
export { Conference } from './entity/Conference';
export { Keyword } from './entity/Keyword';
export { Login } from './entity/Login';
export { Password } from './entity/Password';
export { Role } from './entity/Role';
export { Sequelize } from 'sequelize-typescript';
export { Submission } from './entity/Submission';
export { SubmissionAcademicDiscipline } from './entity/SubmissionAcademicDiscipline';
export { User } from './entity/User';
export { UserAlias } from './entity/UserAlias';
export { UserStatus } from './entity/UserStatus';

/**
 *  All models must be imported from this file or else they will not be registered with Sequelize
 */

export class Models {

  public sequelize: Sequelize;

  constructor(config: any) {
    this.sequelize = new Sequelize(config);
  }

  public async initModels() {
    this.sequelize.addModels(Models.getModels());
    await this.sequelize.sync({force: true});
    await InitialDatabaseUploadCommandService.initData();
    await TestData.initData();
  }

  // TODO Scan models folder to build list
  private static getModels() {
    return [
      AcademicDiscipline, AuthorsAcademicDiscipline, AuthorsSubmission, Conference, Keyword, Login, Password, Role, Submission, SubmissionAcademicDiscipline, SubmissionMessage, User, UserAlias, UserStatus
    ];
  }

  static getModel<T extends Model<T>>(expectedModelName: string): any {
    let modelType: any = null;
    this.getModels().forEach(model => {
      if (model.getTableName() == expectedModelName) {
        modelType = model;
      }
    });
    return modelType;
  }
}


