import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatCheckboxChange, MatDialogRef } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-submission.evaluate',
  templateUrl: './submission.evaluate.component.html',
  styleUrls: ['./submission.evaluate.component.scss']
})
export class SubmissionEvaluateComponent implements OnInit {

  submissionId: number;
  messageTypes: string[];
  submissionEvaluateForm: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
              private dialogRef: MatDialogRef<SubmissionEvaluateComponent>,
              private fb: FormBuilder) {
    this.submissionId = data.submissionId;
    this.messageTypes = data.messageTypes;
  }

  ngOnInit() {
    this.submissionEvaluateForm = this.fb.group({
      submissionId: new FormControl({value: this.submissionId, disabled: true}),
      message: new FormControl('', Validators.required),
      // type: new FormControl('', Validators.required),
      result: new FormControl(false)
    });
  }

  submit() {
    if (this.submissionEvaluateForm.valid) {
      this.dialogRef.close(this.submissionEvaluateForm.getRawValue());
    }
  }

  accept(event: MatCheckboxChange) {
    if (event.checked) {
      this.submissionEvaluateForm.get('message').setValidators(Validators.required);
    } else {
      this.submissionEvaluateForm.get('message').reset();
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
