import * as cloneDeep from 'lodash/cloneDeep';
import { AcademicDiscipline } from '../../../../../models/academic.discipline';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
// import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-update-academic-disciplines',
  templateUrl: './update.academic.disciplines.component.html',
  styleUrls: ['./update.academic.disciplines.component.scss']
})
export class UpdateAcademicDisciplinesComponent implements OnInit {

  all: AcademicDiscipline[];
  selected: AcademicDiscipline[] = [];
  academicDisciplinesForm: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
              private dialogRef: MatDialogRef<UpdateAcademicDisciplinesComponent>,
              private fb: FormBuilder) {
    this.selected = cloneDeep(data.selected);
    this.all = data.all;
  }

  ngOnInit(): void {
    this.academicDisciplinesForm = this.fb.group({
      academicDisciplines: new FormControl(this.selected)
    });
  }

  update() {
    this.dialogRef.close(this.academicDisciplinesForm.value.academicDisciplines);
  }

  cancel() {
    this.dialogRef.close();
  }
}
