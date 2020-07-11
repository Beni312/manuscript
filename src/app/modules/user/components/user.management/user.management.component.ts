import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserManagementService } from '../../../../services/user.management.service';
import { ChangeUserPasswordComponent } from './change-user-password/change-user-password.component';
import { MessageService } from '../../../../services/message.service';

@Component({
  selector: 'app-user.management',
  templateUrl: './user.management.component.html',
  styleUrls: ['./user.management.component.scss'],
  providers: [ UserManagementService ]
})
export class UserManagementComponent implements OnInit {

  displayedColumns = ['id', 'username', 'firstName', 'lastName', 'role', 'email', 'actions'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  constructor(private dialog: MatDialog,
              private userManagementService: UserManagementService,
              private toastrService: ToastrService,
              private messageService: MessageService) {
  }

  ngOnInit() {
    this.userManagementService.getUsers().subscribe((response: any[] ) => {
      this.dataSource = new MatTableDataSource<any>(response);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  openChangeUserPasswordModal(user: any) {
    const dialogRef = this.dialog.open(ChangeUserPasswordComponent, {
      autoFocus: true,
      data: {
        username: user.username
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      this.userManagementService.changeUserPassword(user.id, result.password, user.passwordAgain).subscribe(() => {
        this.toastrService.success('User password changed successfully.');
      }, (err) => {
        this.toastrService.error(err.error);
      });
    });
  }

  openCreateUserModal() {
    const dialogRef = this.dialog.open(UserCreateComponent, {
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      this.userManagementService.createUser({
        user: result.user,
        password: result.password,
        academicDisciplines: result.academicDisciplines.map(a => a.id)
      }).subscribe(resp => {
        this.dataSource = new MatTableDataSource<any>([...this.dataSource.data, resp]);
        this.toastrService.success('User created!');
      }, err => {
        this.toastrService.error(err.error);
      });
    });
  }

  disableUser(user: any) {
    this.messageService.confirm('Do you really want to disable user: ' + user.username + '?').subscribe((result) => {
      if (!result) {
        return null;
      }

      this.userManagementService.changeUserStatus(user.id, 2).subscribe(() => {
        const updated = [...this.dataSource.data];
        updated.find(item => item.id === user.id).status = 'DISABLED';
        this.dataSource = new MatTableDataSource<any>(updated);
        this.toastrService.success('User status disabled!');
      }, (err) => {
        this.toastrService.error(err.error);
      });
    });

  }

  enableUser(user: any) {
    this.messageService.confirm('Do you really want to enable user: ' + user.username + '?').subscribe((result) => {
      if (!result) {
        return null;
      }
      this.userManagementService.changeUserStatus(user.id, 1).subscribe(() => {
        const updated = [...this.dataSource.data];
        updated.find(item => item.id === user.id).status = 'OK';
        this.dataSource = new MatTableDataSource<any>(updated);
        this.toastrService.success('User status Enabled!');
      }, (err) => {
        this.toastrService.error(err.error);
      });
    });
  }
}
