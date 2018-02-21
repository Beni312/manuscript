import { Component, OnInit } from '@angular/core';
import { PersonalDataPreload, ProfileService } from '../../../../services/profile.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AcademicDiscipline } from '../../../../models/academic.discipline';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [ProfileService]
})
export class ProfileComponent implements OnInit {

  preload: PersonalDataPreload;
  personalDataForm: FormGroup;
  academicDisciplinesForm: FormGroup;
  changePasswordForm: FormGroup;
  selectedAcademicDisciplines: AcademicDiscipline[];

  constructor(private profileService: ProfileService, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.profileService.preload().subscribe(response => {
      this.preload = response;
      console.log(this.preload);
    });

    this.personalDataForm = this.fb.group({
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
      })
    });

    this.changePasswordForm = this.fb.group({
      password: this.fb.group({
        password: new FormControl('', {validators: [Validators.required]}),
        passwordAgain: new FormControl('', {validators: [Validators.required]})
      }),
      oldPassword: new FormControl('', {validators: [Validators.required]})
    });

    this.academicDisciplinesForm = this.fb.group({
      academicDisciplines: this.selectedAcademicDisciplines
    });
  }

  save() {
    this.profileService.savePersonalData(this.personalDataForm.value);
  }

  changePassword() {
  }

  updateAcademicDisciplines() {
    this.profileService.updateAcademicDisciplines(this.academicDisciplinesForm.value);
  }
}
