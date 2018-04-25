import { ActivatedRoute } from '@angular/router';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FileSystemFileEntry, UploadEvent, UploadFile } from 'ngx-file-drop';
import { Submission } from '../../../../models/submission';
import { SubmissionPreloadResponse } from '../../../../models/submission.preload.response';
import { SubmissionService } from '../../../../services/submission.service';
import { ToasterService } from 'angular5-toaster/dist';
import { SlideRowAnimation } from '../../../shared/components/mat.row.expand.directive';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss'],
  animations: [SlideRowAnimation]
})
export class SubmissionComponent implements OnInit, AfterViewInit {

  preload: SubmissionPreloadResponse;
  displayedColumns = ['title', 'creationDate', 'lastModifyDate', 'manuscriptAbstract', 'submitter', 'actions'];
  dataSource: MatTableDataSource<Submission>;
  public files: UploadFile[] = [];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

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

  delete(item) {
    this.submissionService.remove(item).subscribe(response => {
      if (!response.exceptionMessage) {
        this.toasterService.pop('success', response.successMessage);
        this.reload();
      } else {
        this.toasterService.pop('warning', response.exceptionMessage);
      }
    });
  }

  reload() {
    this.submissionService.preload().subscribe(resp => {
      this.dataSource = new MatTableDataSource<Submission>(resp.submissions);
    })
  }

  public dropped(event: UploadEvent) {
    this.files = event.files;
    if (event.files.length > 1) {
      this.toasterService.pop('warning', "It's a directory, choose only one file!");
      return;
    }
    for (const droppedFile of event.files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;

        fileEntry.file((file: File) => {
          const formData = new FormData();
          formData.append(file.name, file, droppedFile.relativePath);

          this.submissionService.uploadFile(file).subscribe(response => {
            this.toasterService.pop('success', response.successMessage);
          });
        });
      } else {
        this.toasterService.pop('warning', "It's an empty directory, choose a file.")
      }
    }
  }
}
