import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'angular5-toaster/dist';
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
              private toasterService: ToasterService) {
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
      this.toasterService.pop('error', error.error.exceptionMessage);
    })
  }
}
