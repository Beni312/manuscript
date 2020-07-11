import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-user-password',
  templateUrl: './change-user-password.component.html',
  styleUrls: ['./change-user-password.component.scss']
})
export class ChangeUserPasswordComponent implements OnInit {

  changePasswordForm: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
              private dialogRef: MatDialogRef<ChangeUserPasswordComponent>,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group({
      username: new FormControl({value: this.data.username, disabled: true}),
      password: this.fb.group({
        password: new FormControl('', {validators: [Validators.required, Validators.minLength(4)]}),
        passwordAgain: new FormControl('', {validators: [Validators.required, Validators.minLength(4)]})
      }),
    });
  }

  changePassword() {
    this.dialogRef.close(this.changePasswordForm.getRawValue());
  }

}
