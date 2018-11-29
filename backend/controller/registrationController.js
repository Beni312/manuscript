module.exports = function(app, sequelize, AcademicDiscipline) {
  app.post('/registration/preload', (request, response) => {
    AcademicDiscipline.findAll()
      .then(academicDisciplines => {
        let preload = [];
        academicDisciplines.forEach(a => preload.push({academicDisciplineId: a.id, academicDisciplineName: a.name}));
        response.status(200).send(preload);
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
      });

      fs.writeFile('users.json', JSON.stringify(users),function(err) {
        if (err) {
          response.send(err);
        } else {
          response.status(200).send({successMessage: 'User created'});
        }
      });
    });
  });
};
