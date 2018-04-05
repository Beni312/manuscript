import { ActivatedRoute } from '@angular/router';
import { AfterViewInit, Component, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Submission } from '../../../../models/submission';
import { SubmissionPreloadResponse } from '../../../../models/submission.preload.response';
import { SubmissionService } from '../../../../services/submission.service';
import { ToasterService } from 'angular5-toaster/dist';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('void', style({height: '0px', minHeight: '0', visibility: 'hidden'})),
      state('*', style({height: '*', visibility: 'visible'})),
      transition('void <=> *', animate('250ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class SubmissionComponent implements OnInit, AfterViewInit {

  preload: SubmissionPreloadResponse;
  displayedColumns = ['title', 'creationDate', 'lastModifyDate', 'manuscriptAbstract', 'submitter'];
  dataSource: MatTableDataSource<Submission>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChildren(TemplateRef) rows: QueryList<TemplateRef<any>>;

  constructor(private submissionService: SubmissionService,
              private activatedRoute: ActivatedRoute,
              private toasterService: ToasterService) {
  }

  ngOnInit() {
    this.preload = this.activatedRoute.snapshot.data['preload'];
    if (this.preload.submissions.length === 0) {
      this.toasterService.pop('warning', 'You don' + "'" + 't have any submission!');
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
