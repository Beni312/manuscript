const Sequelize = require('sequelize');
const AcademicDisciplineModel = require("./model/academicDiscipline");
const AuthorModel = require("./model/author");
const AuthorsAcadedemicDisciplinesModel = require("./model/authorsAcademicDisciplines");
const ConferenceModel = require("./model/conference");
const KeywordModel = require("./model/keyword");
const LoginModel = require('./model/login');
const PasswordModel = require('./model/password');
const RoleModel = require('./model/role');
const SubmissionModel = require('./model/submission');
const SubmissionAcademicDisciplineModel = require('./model/submissionAcademicDisciplines');
const UserModel = require('./model/user');
const UserAliasModel = require('./model/userAlias');
const UserStatusModel = require('./model/userStatus');
const resources = require('./resources/academicDisciplines');

const sequelize = new Sequelize('manuscript', 'root', 'root1235', {
  host: 'localhost',
  dialect: 'mysql',
  define: {
    timestamps: false,
    freezeTableName: true
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});
const Role = RoleModel(sequelize, Sequelize);
const AcademicDiscipline = AcademicDisciplineModel(sequelize, Sequelize);
const User = UserModel(sequelize, Sequelize);
const AuthorsAcademicDiscipline = AuthorsAcadedemicDisciplinesModel(sequelize, Sequelize);
const UserAlias = UserAliasModel(sequelize, Sequelize);
const UserStatus = UserStatusModel(sequelize, Sequelize);
const Conference = ConferenceModel(sequelize, Sequelize);
const Login = LoginModel(sequelize, Sequelize);
const Password = PasswordModel(sequelize, Sequelize);
const Submission = SubmissionModel(sequelize, Sequelize);
const SubmissionAcademicDiscipline = SubmissionAcademicDisciplineModel(sequelize, Sequelize);
const Keyword = KeywordModel(sequelize, Sequelize);
const Author = AuthorModel(sequelize, Sequelize);
const bcrypt = require('bcrypt-nodejs');

User.belongsToMany(AcademicDiscipline, {
  through: AuthorsAcademicDiscipline,
  foreignKey: 'userId',
  otherKey: 'academicDisciplineId'
});
Submission.belongsToMany(AcademicDiscipline, {
  through: SubmissionAcademicDiscipline,
  foreignKey: 'submissionId',
  otherKey: 'academicDisciplineId'
});
Submission.belongsToMany(User, {
  through: Author,
  as: 'authors',
  foreignKey: 'submissionId',
  otherKey: 'authorId'
});
Submission.hasMany(Keyword, {
  foreignKey: 'submissionId'
});
Submission.belongsTo(Conference, {
  foreignKey: 'conferenceId'
});
Submission.belongsTo(User, {
  foreignKey: 'submitter',
  as: 'submitterUser'
});
Conference.hasMany(Submission, {
  foreignKey: 'conferenceId'
});
Conference.belongsTo(User, {
  foreignKey: 'submitter'
});
User.belongsTo(Role, {
  foreignKey: 'roleId'
});
User.hasOne(UserAlias, {
  foreignKey: 'userId'
});
User.hasOne(UserStatus, {
  foreignKey: 'statusId'
});
Password.belongsTo(User, {
  foreignKey: 'userId'
});

sequelize.sync({ force: true })
  .then(() => {
    console.log(`Database & tables created!`);
    Role.create({id: 1, name: 'admin'});
    Role.create({id: 2, name: 'author'});
    Role.create({id: 3, name: 'editor'});
    Role.create({id: 4, name: 'reviewer'});
    const salt = bcrypt.genSaltSync();
    const password = bcrypt.hashSync("admin", salt);
    const passwordUser = bcrypt.hashSync("user", salt);
    UserStatus.create({id: 0, status: "ok"});

    User.create({id: 1, email: 'admin@example.com', statusId: 0, title: "admin", firstName: "admin", lastName: "Feri", job: "admin", birthDate: null, roleId: 1})
      .then(() => {
        Password.create({id: 1, password: password, expiryDate: null, salt: salt, userId: 1})
          .then(() => {
            Login.create({username: "admin", passwordId: 1});
          });
        UserAlias.create({username: "admin", userId: 1});
      });

    User.create({id: 2, email: 'user@example.com', statusId: 0, title: "Mr", firstName: "John", lastName: "Smith", job: "user", birthDate: null, roleId: 2})
      .then((user) => {
        Password.create({id: 2, password: passwordUser, expiryDate: null, salt: salt, userId: 2})
          .then(() => {
            Login.create({username: "user", passwordId: 2});
          });
        UserAlias.create({username: "user", userId: 2});
        Conference.create({title: 'Architecture conference', description: 'lorem ipsum lorem ipsum', submitter: user.id})
          .then(conference => {
            Submission.create({title: 'Architecture', manuscriptAbstract: 'lorem ipsum lorem ipsum', submitter: user.id, conferenceId: conference.id})
              .then(submission => {
                SubmissionAcademicDiscipline.create({submissionId: submission.id, academicDisciplineId: 2});
                SubmissionAcademicDiscipline.create({submissionId: submission.id, academicDisciplineId: 3});
                SubmissionAcademicDiscipline.create({submissionId: submission.id, academicDisciplineId: 4});
                SubmissionAcademicDiscipline.create({submissionId: submission.id, academicDisciplineId: 5});
                SubmissionAcademicDiscipline.create({submissionId: submission.id, academicDisciplineId: 6});
                Author.create({submissionId: submission.id, authorId: user.id});
                Keyword.create({submissionId: submission.id, keyword: 'lorem'});
                Keyword.create({submissionId: submission.id, keyword: 'ipsum'});
              })
          });
        Conference.create({title: 'Translation Studies', description: 'lorem ipsum lorem ipsum', submitter: user.id})
          .then(conference => {
            Submission.create({title: 'Translation Studies', manuscriptAbstract: 'lorem ipsum lorem ipsum', submitter: user.id, conferenceId: conference.id})
              .then(submission => {
                SubmissionAcademicDiscipline.create({submissionId: submission.id, academicDisciplineId: 4});
                SubmissionAcademicDiscipline.create({submissionId: submission.id, academicDisciplineId: 8});
                SubmissionAcademicDiscipline.create({submissionId: submission.id, academicDisciplineId: 7});
                Author.create({submissionId: submission.id, authorId: user.id});
                Keyword.create({submissionId: submission.id, keyword: 'lorem'});
                Keyword.create({submissionId: submission.id, keyword: 'ipsum'});
              })
          });
      });
    resources.academicdisciplines.forEach(item => {
      AcademicDiscipline.create({name: item.academicDisciplineName});
    });

     AuthorsAcademicDiscipline.create({userId: 2, academicDisciplineId: 4});
     AuthorsAcademicDiscipline.create({userId: 2, academicDisciplineId: 2});
     AuthorsAcademicDiscipline.create({userId: 2, academicDisciplineId: 3});
     AuthorsAcademicDiscipline.create({userId: 2, academicDisciplineId: 6});
     AuthorsAcademicDiscipline.create({userId: 2, academicDisciplineId: 7});
     AuthorsAcademicDiscipline.create({userId: 2, academicDisciplineId: 8});
}).catch(err => console.log(err));

module.exports = {
  AcademicDiscipline,
  Author,
  AuthorsAcademicDiscipline,
  Conference,
  Keyword,
  Login,
  Password,
  Role,
  Submission,
  SubmissionAcademicDiscipline,
  User,
  UserStatus,
  UserAlias,
  sequelize
};
