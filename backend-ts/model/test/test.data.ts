import {
  AuthorsAcademicDiscipline,
  Conference,
  Keyword,
  Login,
  Password,
  Submission,
  SubmissionAcademicDiscipline,
  User,
  UserAlias
} from "../index";
import * as bcrypt from "bcrypt-nodejs"

export class TestData {

  static async initData() {
    await this.createUser("admin", "admin@gmail.com", 1, "Mr.", "Admin", "admin", "admin", null, 1, "admin");
    await this.createUser("user", "user@gmail.com", 1, "Mr.", "User", "user", "user", null, 2, "user");
    await this.addAcademicDisciplineToUser(2, 3);
    await this.createConference(2, "testConference", "testDescription");
    await this.createSubmission("testSubmission", "nabzscahduaefhuhefosuhefs", 2, 1);
  }

  static async createUser(username, email, statusId, title, firstName, lastName, job, birthDate, roleId, password) {
    const user = await User.create({
      email: email,
      statusId: statusId,
      title: title,
      firstName: firstName,
      lastName: lastName,
      job: job,
      birthDate: birthDate,
      roleId: roleId
    });
    const salt = bcrypt.genSaltSync();
    let hashedPassword = this.createPassword(password, salt);
    const userPassword = await Password.create({
      password: hashedPassword,
      expiryDate: null,
      salt: salt,
      userId: user.id
    });
    await Login.create({username: username, passwordId: userPassword.id});
    await UserAlias.create({username: username, userId: user.id});
  }

  static async createConference(userId, title, description) {
    await Conference.create({title: title, description: description, submitterId: userId});
  }

  static async createSubmission(title, manuscriptAbstract, userId, conferenceId) {
    const submission = await Submission.create({
      title: title,
      manuscriptAbstract: manuscriptAbstract,
      submitterId: userId,
      conferenceId: conferenceId
    });

    await SubmissionAcademicDiscipline.create({submissionId: submission.id, academicDisciplineId: 2});
    await SubmissionAcademicDiscipline.create({submissionId: submission.id, academicDisciplineId: 3});
    await SubmissionAcademicDiscipline.create({submissionId: submission.id, academicDisciplineId: 4});
    await SubmissionAcademicDiscipline.create({submissionId: submission.id, academicDisciplineId: 5});
    await SubmissionAcademicDiscipline.create({submissionId: submission.id, academicDisciplineId: 6});
    await Keyword.create({submissionId: submission.id, keyword: 'lorem'});
    await Keyword.create({submissionId: submission.id, keyword: 'ipsum'});
  }

  static createPassword(password, salt) {
    return bcrypt.hashSync(password, salt);
  }

  static async addAcademicDisciplineToUser(userId, academicDisciplineId) {
    await AuthorsAcademicDiscipline.create({userId: userId, academicDisciplineId: academicDisciplineId});
  }
}
