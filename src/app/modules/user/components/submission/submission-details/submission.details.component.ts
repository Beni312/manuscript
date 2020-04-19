import { AcademicDiscipline } from '../../../../../models/academic.discipline';
import { Author } from '../../../../../models/author';
import { Component, Input, OnInit } from '@angular/core';
import { Submission } from '../../../../../models/submission';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-expand',
  templateUrl: './submission.details.component.html',
  styleUrls: ['./submission.details.component.scss']
})
export class SubmissionDetailsComponent implements OnInit {

  @Input()
  data: Submission;
  dataSource: MatTableDataSource<Author>;
  displayedColumns = ['firstName', 'lastName', 'email'];

  dataSource2: MatTableDataSource<AcademicDiscipline>;
  displayedColumns2 = ['academicDisciplineName'];

  constructor() {
  }

  ngOnInit(): void {
    this.dataSource2 = new MatTableDataSource<any>(this.data.academicDisciplines);
  }
}
