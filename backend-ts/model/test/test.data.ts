import {
  AuthorsAcademicDiscipline, AuthorsSubmission,
  Conference,
  Keyword,
  Login,
  Password,
  Submission,
  SubmissionAcademicDiscipline,
  User,
  UserAlias
} from '../index';
import * as bcrypt from "bcrypt-nodejs";
import { MessageType } from '../enum/MessageType';
import { SubmissionStatus } from '../enum/SubmissionStatus';
import { SubmissionMessage } from '../entity/SubmissionMessage';

export class TestData {

  static async initData() {
    await this.createUser("admin", "admin@gmail.com", 1, "Mr.", "Admin", "admin", "admin", null, 1, "admin");
    await this.createUser("user", "user@gmail.com", 1, "Mr.", "User", "Lajos", "user", null, 2, "user");
    await this.createUser("user1", "user1@gmail.com", 1, "Mr.", "User", "Béla", "user", null, 2, "user");
    await this.createUser("user2", "user2@gmail.com", 1, "Mr.", "User", "Tamás", "user", null, 2, "user");
    await this.createUser("user3", "user3@gmail.com", 1, "Mr.", "User", "Ezékiel", "user", null, 2, "user");
    await this.createUser("user4", "user4@gmail.com", 1, "Mr.", "User", "Britniszpírsz", "user", null, 2, "user");
    await this.createUser("editor", "editor@gmail.com", 1, "Mr.", "Editor", "", "editor", null, 3, "editor");
    await this.createUser("reviewer", "reviewer@gmail.com", 1, "Mr.", "reviewer", "", "reviewer", null, 4, "reviewer");
    await this.addAcademicDisciplineToUser(2, 3);
    await this.createConference(2, "testConference", "testDescription");
    await this.createSubmission("testSubmission", "nabzscahduaefhuhefosuhefs", 2, 1, SubmissionStatus.CREATED);
    await this.createSubmission("testSubmission3", "lorem ipsum", 3, 1, SubmissionStatus.CREATED);
    await this.createSubmission("testSubmission2", "lorem ipsum", 3, 1, SubmissionStatus.CREATED);
    await this.createSubmissionMessage("submissionMessage", MessageType.INFO);
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
    const hashedPassword = this.createPassword(password, salt);
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

  static async createSubmission(title, manuscriptAbstract, userId, conferenceId, status) {
    const submission = await Submission.create({
      title: title,
      manuscriptAbstract: manuscriptAbstract,
      submitterId: userId,
      conferenceId: conferenceId,
      status: status
    });

    await SubmissionAcademicDiscipline.create({submissionId: submission.id, academicDisciplineId: 2});
    await SubmissionAcademicDiscipline.create({submissionId: submission.id, academicDisciplineId: 3});
    await SubmissionAcademicDiscipline.create({submissionId: submission.id, academicDisciplineId: 4});
    await SubmissionAcademicDiscipline.create({submissionId: submission.id, academicDisciplineId: 5});
    await SubmissionAcademicDiscipline.create({submissionId: submission.id, academicDisciplineId: 6});
    await AuthorsSubmission.create({submissionId: submission.id, authorId: userId});
    await Keyword.create({submissionId: submission.id, keyword: 'lorem'});
    await Keyword.create({submissionId: submission.id, keyword: 'ipsum'});
  }

  static async createSubmissionMessage(message, type) {
    await SubmissionMessage.create({message: message, type: type});
  }

  static createPassword(password, salt) {
    return bcrypt.hashSync(password, salt);
  }

  static async addAcademicDisciplineToUser(userId, academicDisciplineId) {
    await AuthorsAcademicDiscipline.create({userId: userId, academicDisciplineId: academicDisciplineId});
  }
}
