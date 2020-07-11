import { AcademicDiscipline } from '../../../../../models/academic.discipline';
import { Author } from '../../../../../models/author';
import { Component, Inject, OnInit } from '@angular/core';
import { ConferenceIdNamePair } from '../../../../../models/conference.id.name.pair';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Submission } from '../../../../../models/submission';

import * as cloneDeep from 'lodash/cloneDeep';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { SystemDataState } from '../../../../../store/system-data/SystemDataReducer';
import { UserState } from '../../../../../store/user/UserReducer';
import { getSystemData } from '../../../../../store/system-data/SystemDataSelector';
import { getUsersState } from '../../../../../store/user/UserSelector';
import { UtilsService } from '../../../../../services/UtilsService';

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
  academicDisciplines: AcademicDiscipline[];
  authors: Author[];

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
              private dialogRef: MatDialogRef<SubmissionUpsertComponent>,
              private fb: FormBuilder,
              private readonly systemDataStore: Store<SystemDataState>,
              private readonly userStore: Store<UserState>) {
    this.submission = cloneDeep(data.submission);
    this.conferences = data.conferences;
  }

  ngOnInit(): void {
    this.submissionCreateForm = this.fb.group({
      id: new FormControl({value: this.submission.id, disabled: true}),
      title: new FormControl(this.submission.title, {
        validators: [Validators.required, Validators.minLength(5)]
      }),
      manuscriptAbstract: new FormControl(this.submission.manuscriptAbstract, {
        validators: [Validators.required, Validators.minLength(5)]
      }),
      conference: new FormControl(this.conferences.find(item => item.id === this.submission.conferenceId), Validators.required),
      authors: new FormControl(this.submission.authors),
      academicDisciplines: new FormControl(this.submission.academicDisciplines, UtilsService.minLengthArray(1)),
      keywords: new FormControl(this.submission.keywords)
    });

    this.systemDataStore.select(getSystemData).subscribe((state) => {
      this.academicDisciplines = cloneDeep(state.academicDisciplines);
    });

    this.userStore.select(getUsersState).subscribe((state) => {
      this.authors = cloneDeep(state.users);
    });
  }

  submit() {
    if (this.submissionCreateForm.valid) {
      this.dialogRef.close(this.submissionCreateForm.getRawValue());
    }
  }

  getFullName(author) {
    return author.firstName + ' ' + author.lastName;
  }

  cancel() {
    this.dialogRef.close();
  }
}
