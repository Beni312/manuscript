import {
  AcademicDiscipline,
  Conference,
  Keyword,
  Login,
  Password,
  Role,
  Submission,
  SubmissionAcademicDiscipline,
  User,
  UserAlias,
  UserStatus
} from "../index";
import { academicDisciplineData } from "../../resource/academic.discipline.data";
import * as bcrypt from "bcrypt-nodejs"

export class TestData {

  static roles: string[] = ["ADMIN", "AUTHOR", "EDITOR", "REVIEWER"];

  static async initData() {
    await this.createRoles();
    await this.createAcademicDisciplines();
    await this.createUserStatuses();
    await this.createUser("admin", "admin@gmail.com", 1, "Mr.", "Admin", "admin", "admin", null, 1, "admin");
    await this.createUser("user", "user@gmail.com", 1, "Mr.", "User", "user", "user", null, 2, "user");
    await this.createConference(2, "testConference", "testDescription");
    await this.createSubmission("testSubmission", "nabzscahduaefhuhefosuhefs", 2, 1);
  }

  static async createRoles() {
    this.roles.forEach(role => Role.create({name: role}));
  }

  static async createAcademicDisciplines() {
    academicDisciplineData.forEach(item => {
      AcademicDiscipline.create({name: item.academicDisciplineName});
    });
  }

  static async createUserStatuses() {
    UserStatus.create({id: 1, status: "OK"});
    UserStatus.create({id: 2, status: "DISABLED"});
  }

  static async createUser(username, email, statusId, title, firstName, lastName, job, birthDate, roleId, password) {
    User.create({
      email: email,
      statusId: statusId,
      title: title,
      firstName: firstName,
      lastName: lastName,
      job: job,
      birthDate: birthDate,
      roleId: roleId
    })
      .then((user) => {
        const salt = bcrypt.genSaltSync();
        let hashedPassword = this.createPassword(password, salt);
        Password.create({password: hashedPassword, expiryDate: null, salt: salt, userId: user.id})
          .then((password) => {
            Login.create({username: username, passwordId: password.id});
          });
        UserAlias.create({username: username, userId: user.id});
      });
  }

  static async createConference(userId, title, description) {
    Conference.create({title: title, description: description, submitterId: userId});
  }

  static async createSubmission(title, manuscriptAbstract, userId, conferenceId) {
    Submission.create({title: title, manuscriptAbstract: manuscriptAbstract, submitterId: userId, conferenceId: conferenceId})
      .then(submission => {
        SubmissionAcademicDiscipline.create({submissionId: submission.id, academicDisciplineId: 2});
        SubmissionAcademicDiscipline.create({submissionId: submission.id, academicDisciplineId: 3});
        SubmissionAcademicDiscipline.create({submissionId: submission.id, academicDisciplineId: 4});
        SubmissionAcademicDiscipline.create({submissionId: submission.id, academicDisciplineId: 5});
        SubmissionAcademicDiscipline.create({submissionId: submission.id, academicDisciplineId: 6});
        Keyword.create({submissionId: submission.id, keyword: 'lorem'});
        Keyword.create({submissionId: submission.id, keyword: 'ipsum'});
      })
  }

  static createPassword(password, salt) {
    return bcrypt.hashSync(password, salt);
  }
}
