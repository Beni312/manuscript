var fs = require('fs');
const express = require('express');
const app  = express();
var busboy = require('connect-busboy');
var _ = require('lodash');
var session = require('express-session');
const bodyParser = require("body-parser");

const port = process.env.PORT || '3000';
app.use(busboy());
app.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: true });

app.use(session({
  secret: '9b2478b417960fda209e14947b7c3d37',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

var auth = function(req, res, next) {
  if (sess && sess.username)
    return next();
  else
    return res.sendStatus(401);
};

var sess;
app.post('/j_spring_security_check', urlencodedParser, (request, response) => {
  let params = request.body;
  let username = request.body.username;
  let users;
  fs.readFile('users.json', 'utf8', function(err, data) {
    if (err) {
      console.log(err);
    }
    users = JSON.parse(data);

    let filteredUser = _.filter(users, function(user) {
      if (user.username === params.username && user.password === params.password) {
        return user;
      }
    });

    if (filteredUser[0]) {
      sess = request.session;
      sess.username = params.username;

      response.status(200).send(
        {
          success: true,
          session: sess
        }
      )
    } else {
      response.status(403).send({
        exceptionMessage: 'Wrong username or password. Please try again.'
      });
    }
  });
});

app.post('/application/preload', auth, (request, response) => {
  let currentUser = sess.username;
  if (currentUser) {
    fs.readFile('users.json', 'utf8', function(err, data) {
      if (err) {
        console.log(err);
      }
      users = JSON.parse(data);

      let user = _.filter(users, function(user) {
        if (user.username === currentUser) {
          return user;
        }
      })[0];

      response.status(200).send(
        {
          username: user.username,
          role: user.role
        }
      );
    });
  }
});

app.post('/logout', (request, response) => {
  request.session.destroy(function(err) {
    if (err) {
      console.log(err);
    } else {
      response.status(200).send({"success":true});
    }
  })
});

app.post('/registration/preload', (request, response) => {
  fs.readFile('academic.disciplines.json', 'utf8', function(err, data) {
    let academicDisciplines = JSON.parse(data);
    response.status(200).send(academicDisciplines);
  });
});

app.post('/registration/create', (request, response) => {
  let params = request.body;
  let usernameUsed = false;
  fs.readFile('users.json', 'utf8', function(err, data) {
    let users = JSON.parse(data);
    _.forEach(users, function(value) {
      if (value.username == params.user.username) {
        usernameUsed = true;
      }
    });
    if (usernameUsed) {
      response.status(403).send({exceptionMessage: 'Username is already used!'});
      return;
    }
    if (params.password.password != params.password.passwordAgain) {
      response.status(403).send({exceptionMessage: 'Password parity check failed. The given passwords are not matched.'});
      return;
    }

    users.push({
      userId: users.length + 1,
      username: params.user.username,
      password: params.password.password,
      role: 'author',
      title: params.user.title,
      firstName: params.user.firstName,
      lastName: params.user.lastName,
      email: params.user.email,
      academicDisciplines: params.academicDisciplines
    })

    fs.writeFile('users.json', JSON.stringify(users),function(err) {
      if (err) {
        response.send(err);
      } else {
        response.status(200).send({successMessage: 'User created'});
      }
    });
  });
});

app.post('/personaldatasettings/preload', (request, response) => {
  let user = getUserByUsername(sess.username);
  response.status(200).send({
    exceptionMessage: null,
    successMessage: null,
    user: {
      title: user.title,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      job: user.job,
      email: user.email
    },
    academicDisciplines: user.academicDisciplines
  })
});

app.post('/personaldatasettings/academicdisciplines', (request, response) => {
  fs.readFile('academic.disciplines.json', 'utf8', function(err, data) {
    let academicDisciplines = JSON.parse(data);
    response.status(200).send(academicDisciplines);
  });
});

app.post('/personaldatasettings/savepersonaldata', (request, response) => {
  let params = request.body;
  fs.readFile('users.json', 'utf8', function(err, data) {
    let users = JSON.parse(data);
    _.forEach(users, function(value) {
      if (value.username == sess.username) {
        value.title = params.user.title;
        value.firstName = params.user.firstName;
        value.lastName = params.user.lastName;
        value.job = params.user.job;
        value.email = params.user.email;
      }
    });
    fs.writeFile('users.json', JSON.stringify(users));
    response.status(200).send({
      successMessage: 'Your personal data has been updated successfully!'
    });
  });
});

app.post('/personaldatasettings/changepassword', (request, response) => {
  let params = request.body;

  let user = getUserByUsername(sess.username);
  if (user.password != params.oldPassword) {
    response.status(403).send({
      exceptionMessage: 'Your password is wrong.'
    });
    return;
  }

  if (params.password.password != params.password.passwordAgain) {
    response.status(403).send({
      exceptionMessage: 'The given passwords are not matched!'
    });
    return;
  }

  fs.readFile('users.json', 'utf8', function(err, data) {
    let users = JSON.parse(data);
    _.forEach(users, function(value) {
      if (value.username == sess.username) {
        value.password = params.password.password;
      }
    });
    fs.writeFile('users.json', JSON.stringify(users));
    response.status(200).send({
      successMessage: 'Your password has changed successfully!'
    });
  });
});

app.post('/personaldatasettings/updatedisciplines', (request, response) => {
  let academicDisciplines = request.body;
  fs.readFile('users.json', 'utf8', function(err, data) {
    let users = JSON.parse(data);
    _.forEach(users, function(value) {
      if (value.username == sess.username) {
        value.academicDisciplines = academicDisciplines;
      }
    });
    fs.writeFile('users.json', JSON.stringify(users));
    response.status(200).send({
      successMessage: 'Your academic disciplines are updated!'
    });
  });
});

app.post('/submission/preload', (request, response) => {
  let user = getUserByUsername(sess.username);

  fs.readFile('submissions.json', 'utf8', (err, data) => {
    let submissions = JSON.parse(data);
    let userSubmissions = [];
    if (user.role == 'ADMIN' || user.role == 'EDITOR') {
      _.forEach(submissions, (value) => {
        userSubmissions.push({
          submissionId: value.submissionId,
          title: value.title,
          creationDate: value.creationDate,
          lastModifyDate: value.lastModifyDate,
          manuscriptAbstract: value.manuscriptAbstract,
          authors: getAuthorsByIds(value.authors),
          keywords: value.keywords,
          academicDisciplines: value.academicDisciplines,
          submitter: getUserById(value.submitter).username
        });
      });
    } else {
      _.forEach(submissions, (value) => {
        if (value.authors.includes(user.userId) || value.submitter == user.userId) {
          userSubmissions.push({
            submissionId: value.submissionId,
            title: value.title,
            creationDate: value.creationDate,
            lastModifyDate: value.lastModifyDate,
            manuscriptAbstract: value.manuscriptAbstract,
            authors: getAuthorsByIds(value.authors),
            keywords: value.keywords,
            academicDisciplines: value.academicDisciplines,
            submitter: getUserById(value.submitter).username
          });
        }
      });
    }
    response.status(200).send({submissions: userSubmissions});
  });
});

app.post('/submission/remove', (request, response) => {
  let id = request.body.submissionId;
  let hasPermission = false;

  fs.readFile('submissions.json', 'utf8', function(err, data) {
    let submissions = JSON.parse(data);
    let filteredSubmissions = _.filter(submissions, function(value) {
      if (value.submissionId != id) {
        return value;
      } else {
        if (getUserById(value.submitter).username == sess.username) {
          hasPermission = true;
        }
      }
    });
    if (hasPermission){
      fs.writeFile('submissions.json', JSON.stringify(filteredSubmissions));
      response.status(200).send({
        successMessage: 'Submission deleted'
      });
    } else {
      response.status(403).send({
        exceptionMessage: "You don't have permission to delete this submission!"
      });
    }
  });
});

app.post('/submission/uploadsubmission', (request, response) => {
  var fstream;
  request.pipe(request.busboy);
  request.busboy.on('file', function (fieldname, file, filename) {
    fstream = fs.createWriteStream(__dirname + '/files/' + filename);
    file.pipe(fstream);
    // fstream.on('close', function () {
    //   response.redirect('back');
    // });
});
    response.status(200).send({
      successMessage: 'success'
    })
});

app.post('/admin/usermanagement', (request, response) => {
  fs.readFile('users.json', 'utf8', function(err, data) {
    let users = JSON.parse(data);
    let resp = [];
    users.forEach(user => {
      resp.push({
        userId: user.userId,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        email: user.email
      });
    });
    response.status(200).send(resp);
  });
});

function getUserByUsername(username) {
  let user;
  var users = JSON.parse(fs.readFileSync('users.json', 'utf8'));

  _.forEach(users, function(value) {
    if (value.username == username) {
      user = value;
    }
  });
  return user;
}

function getUserById(id) {
  let user;
  var users = JSON.parse(fs.readFileSync('users.json', 'utf8'));

  _.forEach(users, function(value) {
    if (value.userId == id) {
      user = value;
    }
  });
  return user;
}

function getUsersByIds(ids) {
  let filteredUsers = [];
  var users = JSON.parse(fs.readFileSync('users.json', 'utf8'));

  _.forEach(users, function(value) {
    if (ids.includes(value.userId)) {
      filteredUsers.push(value);
    }
  });
  return filteredUsers;
}

function getAuthorsByIds(ids) {
  let authors = [];
  let users = getUsersByIds(ids);

  _.forEach(users, function(value) {
    authors.push({
      userId: value.userId,
      email: value.email,
      firstName: value.firstName,
      lastName: value.lastName
    });
  });
  return authors;
}

app.listen(port);
