import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Conference } from '../../../../models/conference';
// import { MatPaginator, MatSort, MatTable, MatTableDataSource } from '@angular/material';
import { SlideRowAnimation } from '../../../shared/components/mat.row.expand.directive';
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTable, MatTableDataSource } from "@angular/material/table";

@Component({
  selector: 'app-conference',
  templateUrl: './conference.component.html',
  styleUrls: ['./conference.component.scss'],
  animations: [SlideRowAnimation]
})
export class ConferenceComponent implements OnInit, AfterViewInit {

  preload: any;

  dataSource: MatTableDataSource<Conference>;

  displayedColumns = ['title', 'description', 'submitter'];

  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatTable, {static: false}) table: MatTable<any>;

  constructor(private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.preload = this.activatedRoute.snapshot.data['preload'];
    this.dataSource = new MatTableDataSource<any>(this.preload);
  }

  ngAfterViewInit(): void {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
  }
}
