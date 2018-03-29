import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { SubmissionService } from '../../../../services/submission.service';
import { Submission } from '../../../../models/submission';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { SubmissionPreloadResponse } from '../../../../models/submission.preload.response';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss']
})
export class SubmissionComponent implements OnInit, AfterViewInit {

  preload: SubmissionPreloadResponse;
  displayedColumns = ['title', 'creationDate', 'lastModifyDate', 'manuscriptAbstract', 'submitter',];
  dataSource: MatTableDataSource<Submission>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private submissionService: SubmissionService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.preload = this.activatedRoute.snapshot.data['preload'];
    this.dataSource = new MatTableDataSource<Submission>(this.preload.submissions);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }



}
