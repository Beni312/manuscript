import { AcademicDiscipline } from '../../../../../models/academic.discipline';
import { Author } from '../../../../../models/author';
import { Component, Inject, OnInit } from '@angular/core';
import { ConferenceIdNamePair } from '../../../../../models/conference.id.name.pair';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Submission } from '../../../../../models/submission';

// class SubmissionUpsert {
//   academicDisciplines: AcademicDiscipline[];
//   authors: Author[];
// }

@Component({
  selector: 'app-submission-upsert',
  templateUrl: './submission.upsert.component.html',
  styleUrls: ['./submission.upsert.component.scss']
})
export class SubmissionUpsertComponent implements OnInit {

  submissionCreateForm: FormGroup;
  academicDisciplines: AcademicDiscipline[];
  conferences: ConferenceIdNamePair[];
  submission: Submission;
  authors: Author[];

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
              private dialogRef: MatDialogRef<SubmissionUpsertComponent>,
              private fb: FormBuilder) {
    this.conferences = data.conferences;
    this.submission = data.submission;
    this.academicDisciplines = data.academicDisciplines;
    this.authors = data.authors;
  }

  ngOnInit(): void {
    this.submissionCreateForm = this.fb.group({
      id: new FormControl({value: this.submission.id, disabled: true}),
      title: new FormControl(this.submission.title, Validators.minLength(5)),
      manuscriptAbstract: new FormControl(this.submission.manuscriptAbstract, Validators.minLength(10)),
      conference: new FormControl(this.conferences.filter(item => item.id === this.submission.conferenceId)[0], Validators.required),
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
