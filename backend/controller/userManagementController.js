module.exports = function(app, sequelize){
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
};
