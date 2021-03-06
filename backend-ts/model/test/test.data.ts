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
} from '../index';
import * as bcrypt from 'bcrypt-nodejs';
import { MessageType } from '../enum/MessageType';
import { SubmissionStatus } from '../enum/SubmissionStatus';
import { SubmissionMessage } from '../entity/SubmissionMessage';
import { ConferenceAcademicDiscipline } from '../entity/ConferenceAcademicDiscipline';
import { Message } from '../entity/Message';
import { Manuscript } from '../entity/Manuscript';

export class TestData {

  static async initData() {
    await this.createUser("admin", "admin@gmail.com", 1, "Mr.", "Admin", "admin", "admin", null, 1, "admin");
    const user = await this.createUser("user", "user@gmail.com", 1, "Mr.", "User", "Lajos", "user", null, 2, "user");
    const user1 = await this.createUser("user1", "user1@gmail.com", 1, "Mr.", "User", "Béla", "user", null, 2, "user");
    const user2 = await this.createUser("user2", "user2@gmail.com", 1, "Mr.", "User", "Tamás", "user", null, 2, "user");
    await this.createUser("user3", "user3@gmail.com", 1, "Mr.", "User", "Ezékiel", "user", null, 2, "user");
    await this.createUser("user4", "user4@gmail.com", 1, "Mr.", "User", "Britniszpírsz", "user", null, 2, "user");
    await this.createUser("editor", "editor@gmail.com", 1, "Mr.", "Editor", "", "editor", null, 3, "editor");
    await this.createUser("reviewer", "reviewer@gmail.com", 1, "Mr.", "reviewer", "", "reviewer", null, 4, "reviewer");
    await this.addAcademicDisciplineToUser(2, 3);
    await this.createConference(2, "testConference", "testDescription");
    const submission = await this.createSubmission("testSubmission", "nabzscahduaefhuhefosuhefs", 2, 1, SubmissionStatus.CREATED);
    const submission2 = await this.createSubmission("testSubmission3", "lorem ipsum", 3, 1, SubmissionStatus.CREATED);
    const submission3 = await this.createSubmission("testSubmission2", "lorem ipsum", 3, 1, SubmissionStatus.CREATED);
    await this.createSubmissionMessage("submissionMessage", MessageType.INFO);

    await this.createMessage(user1.id, user.id, 'mess', new Date(2020, 1, 13, 13, 14, 20));
    await this.createMessage(user1.id, user.id, 'gmrkmgkrm', new Date(2020, 1, 13, 13, 15, 20));
    await this.createMessage(user1.id, user.id, 'mess', new Date(2020, 1, 13, 13, 16, 20));
    await this.createMessage(user2.id, user.id, 'mess', new Date(2020, 1, 13, 13, 14, 20));
    await this.createMessage(user2.id, user.id, 'mess', new Date(2020, 1, 13, 13, 15, 20));
    await this.createMessage(user2.id, user.id, 'mess', new Date(2020, 1, 13, 13, 18, 20));
    await this.createMessage(user.id, user1.id, 'mess', new Date(2020, 1, 13, 13, 14, 50));
    await this.createMessage(user.id, user1.id, 'mess', new Date(2020, 1, 13, 13, 15, 30));
    await this.createMessage(user.id, user2.id, 'mess', new Date(2020, 1, 13, 13, 17, 30));

    this.createManuscript(3, submission3.id, 1, 'test.txt');
    // this.createManuscript(3, submission2.id, 2, 'test2');
    // this.createManuscript(3, submission2.id, 3, 'test3');
    //
    // this.createManuscript(2, submission.id, 1, 'test');
    // this.createManuscript(2, submission.id, 2, 'test2');
    // this.createManuscript(2, submission.id, 3, 'test3');
    // this.createManuscript(2, submission.id, 4, 'test4');
  }

  static async createUser(username, email, statusId, title, firstName, lastName, job, birthDate, roleId, password): Promise<User> {
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

    await UserAlias.create({username: username, userId: user.id});
    await Login.create({username: username, passwordId: userPassword.id});

    return user;
  }

  static async createConference(userId, title, description): Promise<Conference> {
    const conference = await Conference.create({title: title, description: description, submitterId: userId});
    await ConferenceAcademicDiscipline.create({
      conferenceId: conference.id,
      academicDisciplineId: 2
    });
    return conference;
  }

  static async createSubmission(title, manuscriptAbstract, userId, conferenceId, status): Promise<Submission> {
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
    // await AuthorsSubmission.create({submissionId: submission.id, authorId: userId});
    await Keyword.create({submissionId: submission.id, keyword: 'lorem'});
    await Keyword.create({submissionId: submission.id, keyword: 'ipsum'});

    return submission;
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

  static async createMessage(userId: number, to: number, message: string, creationDate: Date, isRead: boolean = false) {
    await Message.create({
      userId: userId,
      to: to,
      message: message,
      creationDate: creationDate,
      isRead: isRead
    })
  }

  static createManuscript(userId: number, submissionId: number, version: number, filename: string): Promise<Manuscript> {
    return Manuscript.create({
      userId: userId,
      submissionId: submissionId,
      version: version,
      filename: filename
    })
  }
}
