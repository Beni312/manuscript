import { AcademicDiscipline } from '../../../../../models/academic.discipline';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

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
    this.selected = Object.assign([], data.selected);
    this.all = data.all;
  }

  ngOnInit(): void {
    this.academicDisciplinesForm = this.fb.group({
      academicDisciplines: []
    });
  }

  update() {
    this.dialogRef.close(this.selected);
  }

  cancel() {
    this.dialogRef.close();
  }
}
