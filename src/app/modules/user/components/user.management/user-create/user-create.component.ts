import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements OnInit {

  createUserForm: FormGroup;

  constructor(private dialogRef: MatDialogRef<UserCreateComponent>,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.createUserForm = this.fb.group({
      user: this.fb.group({
        title: new FormControl('', {
          validators: [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(50)
          ]
        }),
        firstName: new FormControl('', {
          validators: [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(50)
          ]
        }),
        lastName: new FormControl('', {
          validators: [
            Validators.required,
            Validators.minLength(4),
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

  createUser(user) {
    this.dialogRef.close(user);
  }

  cancel() {
    this.dialogRef.close();
  }
}
