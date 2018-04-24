var fs = require('fs');
const express = require('express');
const app  = express();
var busboy = require('connect-busboy');
var _ = require('lodash');
var session = require('express-session');
const bodyParser = require("body-parser");

const port = process.env.PORT || '3000';
app.use(busboy());
var urlencodedParser = bodyParser.urlencoded({ extended: true });

app.use(session({
  secret: '9b2478b417960fda209e14947b7c3d37',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

var auth = function(req, res, next) {
  console.log(sess);
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
  console.log(currentUser);
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
    response.send('OK');
});

app.post('/submission/uploadsubmission', (request, response) => {
  obj.newSubmission = 'submission';
  fs.writeFile('submissions.json', JSON.stringify(obj), function (err) {
    console.log(err);
  });
});
//
// function getUserByUsername(username) {
//   let user = localStorage.getItem('fakeBackendCurrentUser');
//
// },
//
// function getUsersByIds(ids) {
// },


app.listen(port);
