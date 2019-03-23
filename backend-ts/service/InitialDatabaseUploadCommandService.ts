import { AcademicDiscipline, Role, UserStatus } from "../model/index";
import { academicDisciplineData } from "../resource/academic.discipline.data";
import { roles } from "../model/enum/RoleEnum";

export class InitialDatabaseUploadCommandService {

  public static async initData() {
    await this.createRoles();
    await this.createAcademicDisciplines();
    await this.createUserStatuses();
  }

  static async createRoles() {
    for (let i = 0; i < roles.length; i++) {
      await Role.create({name: roles[i]});
    }
  }

  static async createAcademicDisciplines() {
    for (let i = 0; i < academicDisciplineData.length; i++) {
      await AcademicDiscipline.create({name: academicDisciplineData[i].academicDisciplineName});
    }
  }

  static async createUserStatuses() {
    await UserStatus.create({id: 1, status: "OK"});
    await UserStatus.create({id: 2, status: "DISABLED"});
  }
}
