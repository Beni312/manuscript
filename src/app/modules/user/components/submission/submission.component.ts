import { ActivatedRoute } from '@angular/router';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Submission } from '../../../../models/submission';
import { SubmissionPreloadResponse } from '../../../../models/submission.preload.response';
import { SubmissionService } from '../../../../services/submission.service';
import { ToasterService } from 'angular5-toaster/dist';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss']
})
export class SubmissionComponent implements OnInit, AfterViewInit {

  preload: SubmissionPreloadResponse;
  displayedColumns = ['title', 'creationDate', 'lastModifyDate', 'manuscriptAbstract', 'submitter'];
  dataSource: MatTableDataSource<Submission>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private submissionService: SubmissionService,
              private activatedRoute: ActivatedRoute,
              private toasterService: ToasterService) {
  }

  ngOnInit() {
    this.preload = this.activatedRoute.snapshot.data['preload'];
    if (this.preload.submissions.length == 0) {
      this.toasterService.pop('warning', 'You dont have any submission ');
    } else {
      this.dataSource = new MatTableDataSource<Submission>(this.preload.submissions);
    }
  }

  ngAfterViewInit(): void {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
  }


}
