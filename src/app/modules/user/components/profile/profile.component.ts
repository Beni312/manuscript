import { AcademicDiscipline } from '../../../../models/academic.discipline';
import { ActivatedRoute } from '@angular/router';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { PersonalDataPreload, ProfileService } from '../../../../services/profile.service';
import { PermissionHandler } from '../permission.component';
import { ToasterService } from 'angular5-toaster/dist';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends PermissionHandler implements OnInit, AfterViewInit {

  preload: PersonalDataPreload;
  personalDataForm: FormGroup;
  academicDisciplinesForm: FormGroup;
  changePasswordForm: FormGroup;
  selectedAcademicDisciplines: AcademicDiscipline[];
  displayedColumns = ['academicDisciplineName'];
  dataSource: MatTableDataSource<AcademicDiscipline>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(private profileService: ProfileService,
              private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private toasterService: ToasterService) {
    super();
    this.preload = this.activatedRoute.snapshot.data['preload'];
    this.dataSource = new MatTableDataSource<AcademicDiscipline>(this.preload.academicDisciplines);
  }

  ngOnInit() {
    this.personalDataForm = this.fb.group({
      user: this.fb.group({
        title: new FormControl(this.preload.user.title, {
          validators: [Validators.required]
        }),
        firstName: new FormControl(this.preload.user.firstName, {
          validators: [Validators.required]
        }),
        lastName: new FormControl(this.preload.user.lastName, {
          validators: [Validators.required]
        }),
        job: new FormControl(this.preload.user.job, {
          validators: [Validators.required]
        }),
        email: new FormControl(this.preload.user.email, {
          validators: [Validators.required, Validators.email]
        }),
        username: new FormControl(this.preload.user.username, {
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
      academicDisciplines: this.preload.academicDisciplines
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  save() {
    if (this.personalDataForm.valid) {
      this.profileService.savePersonalData(this.personalDataForm.value).subscribe(response => {
        if (!response.exceptionMessage) {
          this.personalDataForm.reset(this.personalDataForm.value);
          this.toasterService.pop('success', response.successMessage);
        } else {
          this.toasterService.pop('error', response.exceptionMessage);
        }
      });
    }
  }

  changePassword() {
    this.profileService.changePassword(this.changePasswordForm.value).subscribe(response => {
      if (!response.exceptionMessage) {
        this.toasterService.pop('success', response.successMessage);
      } else {
        this.toasterService.pop('error', response.exceptionMessage);
      }
    });
  }

  updateAcademicDisciplines() {
    this.profileService.updateAcademicDisciplines(this.academicDisciplinesForm.value);
  }

  resetForm() {
    this.profileService.preload().subscribe(response => {
      this.personalDataForm.reset(response);
    });
  }
}
