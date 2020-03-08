import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { AcademicDiscipline } from '../../../../../models/academic.discipline';
import { Conference } from '../../../../../models/conference';
import { ConferenceSubmission } from '../../../../../models/conference.submission';

@Component({
  selector: 'app-conference-details',
  templateUrl: './conference-details.component.html',
  styleUrls: ['./conference-details.component.scss']
})
export class ConferenceDetailsComponent implements OnInit {

  @Input()
  data: Conference;
  dataSource: MatTableDataSource<ConferenceSubmission>;
  displayedColumns = ['id', 'title', 'status', 'submitter'];

  dataSource2: MatTableDataSource<AcademicDiscipline>;
  displayedColumns2 = ['academicDisciplineName'];

  constructor() { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<any>(this.data.submissions);
    this.dataSource2 = new MatTableDataSource<any>(this.data.academicDisciplines);
  }

}
