import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { ManuscriptUploadService } from '../../../../../services/manuscript-upload.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manuscript-upload',
  templateUrl: './manuscript-upload-modal.component.html',
  styleUrls: ['./manuscript-upload-modal.component.scss']
})
export class ManuscriptUploadModalComponent implements OnInit {

  public files: NgxFileDropEntry[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
              public manuscriptUploadService: ManuscriptUploadService,
              public toastrService: ToastrService) {
  }

  ngOnInit(): void {
  }

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          const formData = new FormData();
          formData.append('manuscript', file, droppedFile.relativePath);
          formData.append('submissionId', this.data.submissionId);
          this.manuscriptUploadService.uploadManuscript(formData).subscribe((resp) => {
            this.toastrService.success(resp.successMessage);
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
