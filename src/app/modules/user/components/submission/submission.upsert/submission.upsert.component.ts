import { AcademicDiscipline } from '../../../../../models/academic.discipline';
import { Author } from '../../../../../models/author';
import { Component, Inject, OnInit } from '@angular/core';
import { ConferenceIdNamePair } from '../../../../../models/conference.id.name.pair';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Submission } from '../../../../../models/submission';

import * as cloneDeep from 'lodash/cloneDeep';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

export class UpsertSubmissionPreload {
  academicDisciplines: AcademicDiscipline[];
  authors: Author[];
}

@Component({
  selector: 'app-submission-upsert',
  templateUrl: './submission.upsert.component.html',
  styleUrls: ['./submission.upsert.component.scss']
})
export class SubmissionUpsertComponent implements OnInit {

  submissionCreateForm: FormGroup;
  conferences: ConferenceIdNamePair[];
  submission: Submission;
  preload: UpsertSubmissionPreload;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
              private dialogRef: MatDialogRef<SubmissionUpsertComponent>,
              private fb: FormBuilder) {
    this.submission = cloneDeep(data.submission);
    this.conferences = data.conferences;
    this.preload = data.preload;
  }

  ngOnInit(): void {
    this.submissionCreateForm = this.fb.group({
      id: new FormControl({value: this.submission.id, disabled: true}),
      title: new FormControl(this.submission.title, Validators.minLength(5)),
      manuscriptAbstract: new FormControl(this.submission.manuscriptAbstract, Validators.minLength(5)),
      conference: new FormControl(this.conferences.find(item => item.id === this.submission.conferenceId), Validators.required),
      authors: new FormControl(this.submission.authors),
      academicDisciplines: new FormControl(this.submission.academicDisciplines, Validators.minLength(1)),
      keywords: new FormControl(this.submission.keywords)
    });
  }

  submit() {
    this.dialogRef.close(this.submissionCreateForm.getRawValue());
  }

  getFullName(author) {
    return author.firstName + ' ' + author.lastName;
  }

  cancel() {
    this.dialogRef.close();
  }
}
