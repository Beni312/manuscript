import { AcademicDiscipline } from '../../../../models/academic.discipline';
import { BasicResponse } from '../../../../models/basic.response';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RegistrationService } from '../../../../services/registration.service';
import { User } from '../../../../models/user';
import { RegisterUser } from '../../../../models/register.user';
import { Password } from '../../../../models/password';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  providers: [RegistrationService]
})
export class RegistrationComponent implements OnInit {

  academicDisciplines: AcademicDiscipline[];
  registrationForm: FormGroup;
  result: BasicResponse;

  constructor(private service: RegistrationService,
              private fb: FormBuilder) {
    this.result = new BasicResponse();
  }

  ngOnInit() {
    this.registrationForm = this.fb.group({
      user: this.fb.group({
        title: new FormControl('123', {
          validators: [Validators.required]
        }),
        firstName: new FormControl('asdas', {
          validators: [Validators.required]
        }),
        lastName: new FormControl('asdda', {
          validators: [Validators.required]
        }),
        job: new FormControl('asdas', {
          validators: [Validators.required]
        }),
        email: new FormControl('asd@ifeifn.com', {
          validators: [Validators.required, Validators.email]
        }),
        username: new FormControl('qweqdc', {
          validators: [Validators.required]
        })
      }),
      password: this.fb.group({
        password: new FormControl('asdqwe123', {
          validators: [Validators.required, Validators.minLength(3)]
        }),
        passwordAgain: new FormControl('asdqwe123', {
          validators: [Validators.required, Validators.minLength(3)]
        })
      }),
      academicDisciplines: new FormControl([])
    });

    this.service.preload().subscribe((academicDisciplines: AcademicDiscipline[]) => {
        this.academicDisciplines = academicDisciplines;
      },
      err => console.log(err)
    );
  }

  register() {
    const form = this.registrationForm.value;
    const createUserCommand = new RegisterUser(
      new User(form.user.title, form.user.firstName, form.user.lastName, form.user.username, form.user.job, form.user.email),
      new Password(form.password.password, form.password.passwordAgain),
      form.academicDisciplines.map(item => item.id)
    );
    if (this.registrationForm.valid) {
      this.service.register(createUserCommand).subscribe(result => {
          this.result = result;
        }, error => {
          this.result.exceptionMessage = error;
        }
      );
    }
  }
}
