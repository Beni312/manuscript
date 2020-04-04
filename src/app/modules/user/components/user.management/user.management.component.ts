import { Component, OnInit, ViewChild } from '@angular/core';
// import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { UserManagementService } from '../../../../services/user.management.service';
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";

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
