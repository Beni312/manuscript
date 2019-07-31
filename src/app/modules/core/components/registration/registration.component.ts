import { AcademicDiscipline } from '../../../../models/academic.discipline';
import { BasicResponse } from '../../../../models/basic.response';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RegistrationService } from '../../../../services/registration.service';
import { User } from '../../../../models/user';

export class UserRegistration {
  user: User;
  password: Password;
  academicDisciplines: AcademicDiscipline[];
}

export class Password {
  password: string;
  passwordAgain: string;
}

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  providers: [RegistrationService]
})
export class RegistrationComponent implements OnInit {

  userRegistration: UserRegistration;
  academicDisciplines: AcademicDiscipline[];
  registrationForm: FormGroup;
  result: BasicResponse;

  constructor(private service: RegistrationService,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.registrationForm = this.fb.group({
      user: this.fb.group({
        title: new FormControl('', {
          validators: [Validators.required]
        }),
        firstName: new FormControl('', {
          validators: [Validators.required]
        }),
        lastName: new FormControl('', {
          validators: [Validators.required]
        }),
        job: new FormControl('', {
          validators: [Validators.required]
        }),
        email: new FormControl('', {
          validators: [Validators.required, Validators.email]
        }),
        username: new FormControl('', {
          validators: [Validators.required]
        })
      }),
      password: this.fb.group({
        password: new FormControl('', {
          validators: [Validators.required, Validators.minLength(4)]
        }),
        passwordAgain: new FormControl('', {
          validators: [Validators.required, Validators.minLength(4)]
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
    this.userRegistration = this.registrationForm.value;
    if (this.registrationForm.valid) {
      this.service.register(this.userRegistration).subscribe(result => {
          this.result = result;
        }, error => {
          this.result = error;
        }
      );
    }
  }
}
