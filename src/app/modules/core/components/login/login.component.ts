import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from '../../../../services/message.service';
import { UserService } from '../../../../services/user.service';

export class Login {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public model: Login;
  public loginForm: FormGroup;

  constructor(private service: UserService,
              private fb: FormBuilder,
              private messageService: MessageService) {
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: new FormControl('', Validators.required),
      password: ['', { validators: [
          Validators.required,
          Validators.minLength(4)
        ]
      }]
    });
  }

  login() {
    this.model = this.loginForm.value;
    this.service.login(this.model.username, this.model.password).subscribe(() => {
      this.service.preload();
    }, error => {
      this.messageService.error(error.exceptionMessage);
    });
  }
}
