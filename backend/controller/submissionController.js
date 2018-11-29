const util = require('../service/util');

module.exports = function(app, User, Conference, Submission, Author, AcademicDiscipline, Keyword) {

  app.post('/submission/preload', util.isLoggedIn, (request, response) => {
    if (request.user.role.toUpperCase() === 'ADMIN') {
      Submission.findAll({include: [
          {
            model: AcademicDiscipline,
            attributes: ['id', 'name'],
            through: { attributes: [] }
          },
          {
            model: User,
            as: 'authors',
            attributes: ['id', 'email','firstName', 'lastName'],
            through: { attributes: [] }
          },
          {
            model: Keyword,
            as: 'keywords'
          }
        ]})
        .then(s => {
          Conference.findAll({attributes: ['id', ['title', 'name']]})
            .then(pairs => {
              response.status(200).send({submissions: s, conferenceIdNamePairs: pairs});
            });

        })
    } else {
      Submission.findAll({include: [
          {
            model: AcademicDiscipline,
            attributes: ['id', 'name'],
            through: { attributes: [] }
          },
          {
            model: User,
            as: 'authors',
            attributes: ['id','email','firstName', 'lastName'],
            through: { attributes: [], where: {authorId: request.user.userId} }
          },
          {
            model: Keyword,
            as: 'keywords',
            attributes: ['keyword']
          }
        ]})
        .then(s => {
          const submissionIds = s.map(item => item.id);
          Conference.findAll({attributes: ['id', 'title'], include: [{model: Submission, where: {id: submissionIds}}]})
            .then(pairs => {
              response.status(200).send({submissions: s, conferenceIdNamePairs: pairs});
            });
        })
    }
  });

  app.post('/submission/remove', util.isLoggedIn, (request, response) => {
    let id = request.body.submissionId;
    Submission.findById(id)
      .then(s => {
        if (s.submitter === request.user.userId || request.user.role === 'ADMIN') {
          s.destroy();
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

  app.post('/submission/uploadsubmission', util.isLoggedIn, (request, response) => {
    var fstream;
    request.pipe(request.busboy);
    request.busboy.on('file', function (fieldname, file, filename) {
      fstream = fs.createWriteStream('../files/' + filename);
      file.pipe(fstream);
    });
    response.status(200).send({
      successMessage: 'success'
    })
  });

  app.post('/submission/conference', util.isLoggedIn, (request, response) => {
    let id = request.body.conferenceId;
    let conf = '';
    if (id !== -1) {
      conf = 'where: {conferenceId:' + id + '}';
    }
    Submission.findAll({
      include: [
        {
          model: AcademicDiscipline,
          attributes: ['id', 'name'],
          through: {attributes: []}
        },
        {
          model: User,
          as: 'authors',
          attributes: ['id', 'email','firstName', 'lastName'],
          through: {attributes: []}
        },
        {
          model: Keyword,
          attributes: ['keyword']
        }
      ], conf
    })
      .then(submissions => {
        response.status(200).send(submissions);
      })
  });
};
