import { ConfirmDialogComponent } from '../modules/shared/components/confirm-dialog/confirm-dialog.component';
import { Injectable } from '@angular/core';
// import { MatDialog, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

@Injectable()
export class MessageService {

  constructor(private dialog: MatDialog, private toasterService: ToastrService) {
  }

  public success(message: string, title?: string): void {
    this.toasterService.success(message, title);
  }

  public error(message: string, title?: string): void {
    this.toasterService.error(message, title);
  }

  public warning(message: string, title?: string): void {
    this.toasterService.warning(message, title);
  }

  public confirm(message: string): Observable<boolean> {
    const dialogRef: MatDialogRef<ConfirmDialogComponent> = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '500px',
      data: {message}
    });

    return dialogRef.afterClosed();
  }
}
