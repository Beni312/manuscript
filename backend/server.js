const conf = require('./config/setupPassport');
const port = process.env.PORT || '3000';
const passport = require('passport');
const express = require('express');
const app  = express();
const busboy = require('connect-busboy');
const session = require('express-session');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const {
  AcademicDiscipline,
  AuthorsAcademicDiscipline,
  Author,
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
} = require('./sequelize');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(busboy());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
   secret: '9b2478b417960fda209e14947b7c3d37',
   resave: false,
   saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Controllers
require("./controller/authenticationController")(app);
require("./controller/userController")(app, sequelize);
require("./controller/userManagementController")(app, User, UserAlias, Role);
require("./controller/profileController")(app, sequelize, User, UserAlias, Password, AcademicDiscipline, AuthorsAcademicDiscipline);
require("./controller/registrationController")(app, sequelize, AcademicDiscipline);
require("./controller/submissionController")(app, User, Conference, Submission, Author, AcademicDiscipline, Keyword);

app.listen(port);
