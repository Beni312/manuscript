import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { SystemDataState } from '../../../../../store/system-data/SystemDataReducer';
import { AcademicDiscipline } from '../../../../../models/academic.discipline';
import { getSystemData } from '../../../../../store/system-data/SystemDataSelector';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements OnInit {

  createUserForm: FormGroup;
  academicDisciplines: AcademicDiscipline[];

  @ViewChild('titleInput', {static: false}) titleFieldEl: ElementRef;

  constructor(private dialogRef: MatDialogRef<UserCreateComponent>,
              private fb: FormBuilder,
              private readonly store: Store<SystemDataState>) {
  }

  ngOnInit(): void {
    this.store.select(getSystemData).subscribe((state: SystemDataState) => {
      this.academicDisciplines = [...state.academicDisciplines];
    });

    this.createUserForm = this.fb.group({
      user: this.fb.group({
        title: new FormControl('', {
          validators: [
            Validators.required,
            Validators.maxLength(50)
          ]
        }),
        firstName: new FormControl('', {
          validators: [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(50)
          ]
        }),
        lastName: new FormControl('', {
          validators: [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(50)]
        }),
        job: new FormControl('', {
          validators: [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(50)
          ]
        }),
        email: new FormControl('', {
          validators: [
            Validators.required,
            Validators.email,
            Validators.minLength(4),
            Validators.maxLength(50)
          ]
        }),
        username: new FormControl('', {
          validators: [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(20)
          ]
        })
      }),
      password: this.fb.group({
        password: new FormControl('', {
          validators: [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(50)]
        }),
        passwordAgain: new FormControl('', {
          validators: [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(50)
          ]
        })
      }),
      academicDisciplines: new FormControl([])
    });
  }

  createUser() {
    this.dialogRef.close(this.createUserForm.value);
  }

  cancel() {
    this.dialogRef.close();
  }
}
