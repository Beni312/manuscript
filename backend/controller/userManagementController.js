module.exports = function(app, User, UserAlias, Role){
  app.post('/admin/usermanagement', (request, response) => {
    User.findAll({
      include: [
        {
          model: UserAlias,
          attributes: ['username']
        },
        {
          model: Role,
          attributes: ['name']
        }
      ],
      attributes: ['id', 'firstName', 'lastName', 'email']
    }).then(users => {
      let usersDto = [];
      users.forEach(user => {
        usersDto.push({
          id: user.id,
          title: user.title,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.userAlias.username,
          job: user.job,
          email: user.email,
          role: user.role.name
        })
      });
      response.status(200).send(usersDto);
    })
  });
};
