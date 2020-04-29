import { ActivatedRoute } from '@angular/router';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Author } from '../../../../models/author';
import { BasicResponse } from '../../../../models/basic.response';
import { ConferenceIdNamePair } from '../../../../models/conference.id.name.pair';
import { MessageService } from '../../../../services/message.service';
import { PermissionHandler } from '../permission.handler';
import { SlideRowAnimation } from '../../../shared/components/mat.row.expand.directive';
import { Submission } from '../../../../models/submission';
import { SubmissionPreloadResponse } from '../../../../models/submission.preload.response';
import { SubmissionService } from '../../../../services/submission.service';
import { SubmissionUpsertComponent, UpsertSubmissionPreload } from './submission.upsert/submission.upsert.component';
import { SubmissionEvaluateComponent } from './submission.evaluate/submission.evaluate.component';
import { SubmissionCreate } from '../../../../models/submission.create';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

export class SubmissionStatus {
  id: number;
  status: string;

  constructor(id: number, status: string) {
    this.id = id;
    this.status = status;
  }
}

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss'],
  animations: [SlideRowAnimation]
})
export class SubmissionComponent extends PermissionHandler implements OnInit, AfterViewInit {

  preload: SubmissionPreloadResponse;
  upsertSubmissionPreload: UpsertSubmissionPreload;
  displayedColumns = ['title', 'creationDate', 'lastModifyDate', 'submitter', 'status', 'actions'];
  dataSource: MatTableDataSource<Submission>;
  selectedConference: any;
  selectedStatus: SubmissionStatus;
  filterConferences: ConferenceIdNamePair[] = [];
  statuses: Array<SubmissionStatus> = new Array<SubmissionStatus>();

  authors: Author[];

  // public files: UploadFile[] = [];

  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatTable, {static: false}) table: MatTable<Submission>;

  ngAfterViewInit(): void {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
  }

  constructor(private submissionService: SubmissionService,
              private activatedRoute: ActivatedRoute,
              private messageService: MessageService,
              private dialog: MatDialog) {
    super();
    this.preload = this.activatedRoute.snapshot.data['preload'];
    const allConference = new ConferenceIdNamePair(-1, 'All conference');
    this.filterConferences = this.preload.conferenceIdNamePairs;
    this.filterConferences.unshift(allConference);
    this.selectedConference = allConference;
    if (this.preload.submissions.length === 0) {
      this.messageService.warning('You don\'t have any submission!');
    } else {
      this.dataSource = new MatTableDataSource<Submission>(this.preload.submissions);
      // TODO
      if (this.activatedRoute.routeConfig.path.includes(':id')) {
        this.activatedRoute.url.subscribe(urlSegment => {
          if (urlSegment.length === 2) {
            console.log('submission: ' + urlSegment[urlSegment.length - 1]);

          } else {
            console.log('conference: ' + urlSegment[urlSegment.length - 1]);
            this.filterByConference(+urlSegment[urlSegment.length - 1]);
          }
        });
      }
    }
  }

  filterByConference(conferenceId: number) {
    if (conferenceId === -1) {
      this.dataSource.data = this.preload.submissions;
    } else {
      this.dataSource.data = this.preload.submissions.filter((s) => s.conferenceId === conferenceId);
    }
  }

  // filterForStatus(status: SubmissionStatus) {
  //   if (status.id === -1) {
  //     this.filterByConference(this.selectedConference.id);
  //   } else {
  //     this.dataSource.data = this.dataSource.data.filter((s) => s.status === status.status);
  //   }
  // }

  filter() {
    this.dataSource.data = this.preload.submissions
      .filter((s) => this.selectedConference.id === -1 || s.conferenceId === this.selectedConference.id)
      .filter((s) => this.selectedStatus.id === -1 || s.status === this.selectedStatus.status);
  }

  create() {
    if (!this.upsertSubmissionPreload) {
      this.getPreload().then(() => {
        this.openCreatePopup();
      });
    } else {
      this.openCreatePopup();
    }
  }

  openCreatePopup() {
    const conferences = this.filterConferences.filter(item => item.id !== -1);

    const dialogRef = this.dialog.open(SubmissionUpsertComponent, {
      autoFocus: true,
      data: {
        preload: this.upsertSubmissionPreload,
        submission: new Submission(),
        conferences: conferences
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      this.submissionService.create(
        new SubmissionCreate(
          result.title,
          result.manuscriptAbstract,
          result.conference.id,
          result.authors.map(a => a.id),
          result.keywords.map(k => k.keyword),
          result.academicDisciplines.map(a => a.id))
      ).subscribe((resp: BasicResponse) => {
        this.reload();
        this.messageService.success(resp.successMessage);
      });
    });
  }

  edit(submissionId) {
    const conferences = this.filterConferences.filter(item => item.id !== -1);
    if (!this.upsertSubmissionPreload) {
      this.getPreload().then(() => {
        this.openEditPopup(submissionId, conferences);
      });
    } else {
      this.openEditPopup(submissionId, conferences);
    }
  }

  getPreload(): Promise<void> {
    return this.submissionService.upsertSubmissionPreload().toPromise().then((preload: UpsertSubmissionPreload) => {
      this.upsertSubmissionPreload = preload;
    });
  }

  openEditPopup(submissionId, conferences) {
    const dialogRef = this.dialog.open(SubmissionUpsertComponent, {
      autoFocus: true,
      data: {
        preload: this.upsertSubmissionPreload,
        submission: this.preload.submissions.find(item => item.id === submissionId),
        conferences: conferences
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      this.submissionService.edit(result).subscribe(response => {
        this.reload();
        this.messageService.success(response.successMessage);
      });
    });
  }

  evaluate(submissionId) {
    const dialogRef = this.dialog.open(SubmissionEvaluateComponent, {
      width: '600px',
      autoFocus: false,
      data: {
        submissionId: submissionId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      this.submissionService.evaluate(result).subscribe(response => {
        this.reload();
        this.messageService.success(response.successMessage);
      });
    });
  }

  confirmDelete(item): void {
    this.messageService.confirm('Are you sure want to delete?').subscribe(result => {
      if (!result) {
        return null;
      }
      this.deleteSubmission(item);
    });
  }

  deleteSubmission(item): void {
    this.submissionService.remove(item).subscribe(response => {
      if (!response.exceptionMessage) {
        this.messageService.success(response.successMessage);
        this.reload();
      } else {
        this.messageService.error(response.exceptionMessage);
      }
    });
  }

  confirmSubmit(submissionId): void {
    this.messageService.confirm('Are you sure want to submit?').subscribe(result => {
      if (!result) {
        return null;
      }
      this.submit(submissionId);
    });
  }

  submit(submissionId) {
    this.submissionService.submit(submissionId).subscribe(response => {
      this.messageService.success(response.successMessage);
      this.reload();
    });
  }

  reload() {
    this.submissionService.preload().subscribe(resp => {
      this.dataSource = new MatTableDataSource<Submission>(resp.submissions);
      this.preload = resp;
      this.filter();
    });
  }

  // public dropped(event: UploadEvent) {
  //   this.files = event.files;
  //   if (event.files.length > 1) {
  //     this.messageService.warning('warning', 'It\'s a directory, choose only one file!');
  //     return;
  //   }
  //   for (const droppedFile of event.files) {
  //     if (droppedFile.fileEntry.isFile) {
  //       const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
  //
  //       fileEntry.file((file: File) => {
  //         const formData = new FormData();
  //         formData.append(file.name, file, droppedFile.relativePath);
  //
  //         this.submissionService.uploadFile(file).subscribe(response => {
  //           this.messageService.success(response.successMessage);
  //         });
  //       });
  //     } else {
  //       this.messageService.warning('It\'s an empty directory, choose a file.');
  //     }
  //   }
  // }

  // openUploadManuscriptPopup(submissionId: number) {
  //   const dialogRef = this.dialog.open(ManuscriptUploadModalComponent, {
  //     autoFocus: true,
  //     data: {
  //       submissionId: submissionId
  //     }
  //   });
  //
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (!result) {
  //       return;
  //     }
  //     this.reload();
  //   });
  // }

  ngOnInit(): void {
    this.selectedStatus = new SubmissionStatus(-1, 'All status');
    this.statuses.push(this.selectedStatus);
    this.preload.statuses.forEach((s, index) => this.statuses.push(new SubmissionStatus(index, s)));
  }
}
