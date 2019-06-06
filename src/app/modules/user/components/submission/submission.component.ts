import { ActivatedRoute } from '@angular/router';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Author } from '../../../../models/author';
import { ConferenceIdNamePair } from '../../../../models/conference.id.name.pair';
import { FileSystemFileEntry, UploadEvent, UploadFile } from 'ngx-file-drop';
import { MatDialog, MatPaginator, MatSort, MatTable, MatTableDataSource } from '@angular/material';
import { MessageService } from '../../../../services/message.service';
import { PermissionHandler } from '../permission.handler';
import { SlideRowAnimation } from '../../../shared/components/mat.row.expand.directive';
import { Submission } from '../../../../models/submission';
import { SubmissionPreloadResponse } from '../../../../models/submission.preload.response';
import { SubmissionService } from '../../../../services/submission.service';
import { SubmissionUpsertComponent, UpsertSubmissionPreload } from './submission.upsert/submission.upsert.component';
import { SubmissionEvaluateComponent } from './submission.evaluate/submission.evaluate.component';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss'],
  animations: [SlideRowAnimation]
})
export class SubmissionComponent extends PermissionHandler implements AfterViewInit {

  preload: SubmissionPreloadResponse;
  upsertSubmissionPreload: UpsertSubmissionPreload;
  displayedColumns = ['title', 'creationDate', 'lastModifyDate', 'manuscriptAbstract', 'submitter', 'status', 'actions'];
  dataSource: MatTableDataSource<Submission>;
  selectedConference: any;
  filterConferences: ConferenceIdNamePair[] = [];

  authors: Author[];

  public files: UploadFile[] = [];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) table: MatTable<Submission>;

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
            this.filter(+urlSegment[urlSegment.length - 1]);
          }
        });
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
  }

  filter(conferenceId: number) {
    this.submissionService.getFilteredByConference(conferenceId).subscribe(submissions => {
      this.dataSource.data = submissions;
    });
  }

  edit(submissionId) {
    const conferences = this.filterConferences.filter(item => item.id !== -1);
    if (!this.authors) {
      this.submissionService.upsertSubmissionPreload().toPromise().then((preload: UpsertSubmissionPreload) => {
        this.upsertSubmissionPreload = preload;
        this.openEditPopup(submissionId, conferences);
      });
      return;
    }
    this.openEditPopup(submissionId, conferences);
  }

  openEditPopup(submissionId, conferences) {
    console.log(this.preload.submissions.find(item => item.id === submissionId));
    const dialogRef = this.dialog.open(SubmissionUpsertComponent, {
      width: '600px',
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

  reload() {
    this.submissionService.preload().subscribe(resp => {
      this.dataSource = new MatTableDataSource<Submission>(resp.submissions);
      this.preload = resp;
    });
  }

  public dropped(event: UploadEvent) {
    this.files = event.files;
    if (event.files.length > 1) {
      this.messageService.warning('warning', 'It\'s a directory, choose only one file!');
      return;
    }
    for (const droppedFile of event.files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;

        fileEntry.file((file: File) => {
          const formData = new FormData();
          formData.append(file.name, file, droppedFile.relativePath);

          this.submissionService.uploadFile(file).subscribe(response => {
            this.messageService.success(response.successMessage);
          });
        });
      } else {
        this.messageService.warning('It\'s an empty directory, choose a file.');
      }
    }
  }
}
