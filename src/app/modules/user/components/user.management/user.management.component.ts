import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { UserManagementService } from '../../../../services/user.management.service';

@Component({
  selector: 'app-user.management',
  templateUrl: './user.management.component.html',
  styleUrls: ['./user.management.component.scss'],
  providers: [ UserManagementService ]
})
export class UserManagementComponent implements OnInit {

  users: any;
  displayedColumns = ['userId', 'username', 'firstName', 'lastName', 'role', 'email'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private userManagementService: UserManagementService) {
  }

  ngOnInit() {
    this.userManagementService.getUsers().subscribe((response: any[] ) => {
      this.dataSource = new MatTableDataSource<any>(response);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }
}
