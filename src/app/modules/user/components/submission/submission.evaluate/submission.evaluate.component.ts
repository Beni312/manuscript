import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-submission.evaluate',
  templateUrl: './submission.evaluate.component.html',
  styleUrls: ['./submission.evaluate.component.scss']
})
export class SubmissionEvaluateComponent implements OnInit {

  submissionId: number;
  submissionEvaluateForm: FormGroup;
  results = [{
    success: true,
    label: 'Accept'
  }, {
    success: false,
    label: 'Reject'
  }];

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
              private dialogRef: MatDialogRef<SubmissionEvaluateComponent>,
              private fb: FormBuilder) {
    this.submissionId = data.submissionId;
  }

  ngOnInit(): void {
    this.submissionEvaluateForm = this.fb.group({
      submissionId: new FormControl({value: this.submissionId, disabled: true}),
      message: new FormControl('', Validators.required),
      success: new FormControl({value: false})
    });
  }

  submit(): void {
    if (this.submissionEvaluateForm.valid) {
      this.dialogRef.close(this.submissionEvaluateForm.getRawValue());
    }
  }

  accept(event: MatSelectChange): void {
    if (!event.value.success) {
      this.submissionEvaluateForm.get('message').setValidators(Validators.required);
    } else {
      this.submissionEvaluateForm.get('message').setValidators([]);
    }

    this.submissionEvaluateForm.get('message').reset();
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
