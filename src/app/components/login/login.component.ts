import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';

export class Login {
  username: string;
  password: string;

  constructor() {
    this.username = '';
    this.password = '';
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public model: Login = new Login();

  constructor(private service: UserService) {
  }

  login() {
    this.service.login(this.model.username, this.model.password);
  }
}
