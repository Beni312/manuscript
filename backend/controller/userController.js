const util = require('../service/util');

module.exports = function(app, sequelize) {
  app.post('/application/preload', util.isLoggedIn, (request, response) => {
    response.status(200).send({username: request.user.username, role: request.user.role});
  });

  app.post('/logout', util.isLoggedIn, (request, response) => {
    request.logout();
    response.status(200).send({"success":true});
  });
};
