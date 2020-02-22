import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from '../../../../services/message.service';
import { Router } from '@angular/router';
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
              private messageService: MessageService,
              private router: Router) {
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
    this.service.login(this.model.username, this.model.password).subscribe((resp) => {
      localStorage.setItem('currentUser', JSON.stringify(resp));
      this.router.navigate(['']);
    }, error => {
      this.messageService.error(error);
    });
  }
}
