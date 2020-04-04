import { AcademicDiscipline } from '../../../../models/academic.discipline';
import { ActivatedRoute } from '@angular/router';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MessageService } from '../../../../services/message.service';
import { PersonalDataPreload, ProfileService } from '../../../../services/profile.service';
import { PermissionHandler } from '../permission.handler';
import { UpdateAcademicDisciplinesComponent } from './update.academic.disciplines/update.academic.disciplines.component';
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends PermissionHandler implements OnInit, AfterViewInit {

  preload: PersonalDataPreload;
  personalDataForm: FormGroup;
  changePasswordForm: FormGroup;
  displayedColumns = ['academicDisciplineName'];
  dataSource: MatTableDataSource<AcademicDiscipline>;

  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;


  constructor(private profileService: ProfileService,
              private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private messageService: MessageService,
              private dialog: MatDialog) {
    super();
    this.preload = this.activatedRoute.snapshot.data['preload'];
    this.dataSource = new MatTableDataSource<AcademicDiscipline>(this.preload.academicDisciplines);
  }

  ngOnInit() {
    this.personalDataForm = this.fb.group({
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
      })
    });

    this.changePasswordForm = this.fb.group({
      password: this.fb.group({
        password: new FormControl('', {validators: [Validators.required, Validators.minLength(4)]}),
        passwordAgain: new FormControl('', {validators: [Validators.required, Validators.minLength(4)]})
      }),
      oldPassword: new FormControl('', {validators: [Validators.required, Validators.minLength(4)]})
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  save() {
    if (this.personalDataForm.valid) {
      this.profileService.savePersonalData(this.personalDataForm.value).subscribe(response => {
        this.personalDataForm.reset(this.personalDataForm.value);
        this.messageService.success(response.successMessage);
      });
    }
  }

  changePassword() {
    if (!this.changePasswordForm.valid) {
      return;
    }
    this.profileService.changePassword(this.changePasswordForm.value).subscribe(response => {
      this.messageService.success(response.successMessage);
    });
  }

  updateAcademicDisciplines() {
    this.profileService.getAcademicDisciplines().subscribe(response => {
      const dialogRef = this.dialog.open(UpdateAcademicDisciplinesComponent, {
        width: '600px',
        autoFocus: false,
        data: {
          all: response,
          selected: this.preload.academicDisciplines
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (!result) {
          return;
        }
        this.profileService.updateAcademicDisciplines(result).subscribe(response => {
          this.reloadAcademicDisciplines();
          this.messageService.success(response.successMessage);
        });
      });
    });
  }

  resetForm() {
    this.profileService.preload().subscribe(response => {
      this.personalDataForm.reset(response);
    });
  }

  reloadAcademicDisciplines() {
    this.profileService.preload().subscribe(response => {
      this.dataSource.data = response.academicDisciplines;
      this.preload.academicDisciplines = response.academicDisciplines;
    });
  }
}
