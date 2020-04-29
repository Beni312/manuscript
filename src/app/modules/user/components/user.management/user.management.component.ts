import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserManagementService } from '../../../../services/user.management.service';

@Component({
  selector: 'app-user.management',
  templateUrl: './user.management.component.html',
  styleUrls: ['./user.management.component.scss'],
  providers: [ UserManagementService ]
})
export class UserManagementComponent implements OnInit {

  users: any;
  displayedColumns = ['id', 'username', 'firstName', 'lastName', 'role', 'email'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  constructor(private dialog: MatDialog,
              private userManagementService: UserManagementService,
              private toastrService: ToastrService) {
  }

  ngOnInit() {
    this.userManagementService.getUsers().subscribe((response: any[] ) => {
      this.dataSource = new MatTableDataSource<any>(response);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  openChangeUserPasswordModal(userId: number) {
  }

  openCreateUserModal() {
    const dialogRef = this.dialog.open(UserCreateComponent, {
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      this.userManagementService.createUser(result).subscribe(resp => {
        console.log(resp);
        this.toastrService.success('User created!');
      }, err => {
        this.toastrService.error(err.error);
      });
    });
  }
}
