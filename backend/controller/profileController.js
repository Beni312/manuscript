const bcrypt = require('bcrypt-nodejs');
const util = require('../service/util');
const HashSet = require('hashset');

module.exports = function(app, sequelize, User, UserAlias, Password, AcademicDiscipline, AuthorsAcademicDiscipline) {
  app.post('/personaldatasettings/preload', util.isLoggedIn, (request, response) => {
    User.findById(request.user.userId, {
      include: [
        {
          model: AcademicDiscipline,
          attributes: ['id', 'name'],
          through: { attributes: [] }
        },
        {
          model: UserAlias,
          attributes: ['username']
        }
      ]
    }).then(user => {
      response.status(200).send({
        exceptionMessage: null,
        successMessage: null,
        user: {
          title: user.title,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.userAlias.username,
          job: user.job,
          email: user.email
        },
        academicDisciplines: user.academicDisciplines
      });
    }).catch(err => console.log(err));
  });

  app.post('/personaldatasettings/academicdisciplines', util.isLoggedIn, (request, response) => {
    AcademicDiscipline.findAll()
      .then(academicDisciplines => {
        response.status(200).send(academicDisciplines);
      });
  });

  app.post('/personaldatasettings/savepersonaldata', util.isLoggedIn, (request, response) => {
    let params = request.body;
    User.update({
      title: params.user.title,
      firstName: params.user.firstName,
      lastName: params.user.lastName,
      job: params.user.job,
      email: params.user.email
    }, {
      where: {
        id: request.user.userId
      }
    }).then(() => {
      response.status(200).send({
        successMessage: 'Your personal data has been updated successfully!'
      });
    });
  });

  app.post('/personaldatasettings/changepassword', util.isLoggedIn, (request, response) => {
    let params = request.body;

    if (params.password.password != params.password.passwordAgain) {
      response.status(403).send({
        exceptionMessage: 'The given passwords are not matched!'
      });
      return;
    }

    Password.findOne({
      where: {
        userId: request.user.userId
      }
    }).then(password => {
      let isMatch = bcrypt.compareSync(params.oldPassword, password.password);
      if (isMatch) {
        const salt = bcrypt.genSaltSync();
        password.update({password: bcrypt.hashSync(params.password.password, salt), salt: salt})
          .then(() => {
            response.status(200).send({
              successMessage: 'Your password has changed successfully!'
            });
          });
      } else {
        response.status(403).send({
          exceptionMessage: 'Your password is wrong.'
        });
      }
    });
  });

  app.post('/personaldatasettings/updatedisciplines', util.isLoggedIn, (request, response) => {
    let academicDisciplines = request.body;
    AuthorsAcademicDiscipline.findAll({where: {userId: request.user.userId}})
      .then(authorsDisciplines => {
        let userDisciplines = new HashSet();
        let updateDisciplines = new HashSet();
        academicDisciplines.forEach(item => {
          updateDisciplines.add(item.id);
        });
        authorsDisciplines.forEach(item => {
          userDisciplines.add(item.academicDisciplineId);
        });
        academicDisciplines.forEach(item => {
          if (!userDisciplines.contains(item.id)) {
            AuthorsAcademicDiscipline.create({userId: request.user.userId, academicDisciplineId: item.id});
          }
        });
        authorsDisciplines.forEach(item => {
          if (!updateDisciplines.contains(item.academicDisciplineId)) {
            AuthorsAcademicDiscipline.destroy({where: {userId: request.user.userId, academicDisciplineId: item.academicDisciplineId}});
          }
        });
        response.status(200).send({
          successMessage: 'Your academic disciplines has changed successfully!'
        });
      });
  });
};
