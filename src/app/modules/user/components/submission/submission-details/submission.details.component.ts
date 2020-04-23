import * as fileSaver from 'file-saver';
import { Component, Input, OnInit } from '@angular/core';
import { AcademicDiscipline } from '../../../../../models/academic.discipline';
import { MatTableDataSource } from '@angular/material/table';
import { ManuscriptService } from '../../../../../services/manuscript.service';
import { Submission } from '../../../../../models/submission';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-expand',
  templateUrl: './submission.details.component.html',
  styleUrls: ['./submission.details.component.scss']
})
export class SubmissionDetailsComponent implements OnInit {

  @Input()
  data: Submission;

  dataSource: MatTableDataSource<any>;
  displayedColumns = ['id', 'version', 'creationDate', 'download'];

  dataSource2: MatTableDataSource<AcademicDiscipline>;
  displayedColumns2 = ['academicDisciplineName'];

  public files: NgxFileDropEntry[] = [];

  constructor(private manuscriptService: ManuscriptService,
              public toastrService: ToastrService) {
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>(this.data.manuscripts);
    this.dataSource2 = new MatTableDataSource<any>(this.data.academicDisciplines);
  }

  download(manuscript) {
    this.manuscriptService.downloadManuscript(manuscript.id).subscribe((resp) => {
      this.downloadFile(resp, manuscript.filename);
    })
  }

  downloadFile(data, filename: string) {
    const blob = new Blob([data], { type: 'multipart/form-data' });
    fileSaver.saveAs(blob, filename);
  }

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {

      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          const formData = new FormData();
          formData.append('manuscript', file, droppedFile.relativePath);
          formData.append('submissionId', this.data.id.toString());
          this.manuscriptService.uploadManuscript(formData).subscribe((resp) => {
            this.toastrService.success('Manuscript successfully uploaded!');
            this.data.manuscripts.push(resp);
            this.dataSource = new MatTableDataSource<any>(this.data.manuscripts);
          }, error => {
            this.toastrService.error(error);
          });
        });
      } else {
        this.toastrService.error('Select a directory!');
      }
    }
  }

  public fileOver(event) {
    console.log(event);
  }

  public fileLeave(event) {
    console.log(event);
  }
}
