import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../../../../services/message.service';
import { MatPaginator, MatSort, MatTable, MatTableDataSource } from '@angular/material';
import { SlideRowAnimation } from '../../../shared/components/mat.row.expand.directive';

@Component({
  selector: 'app-conference',
  templateUrl: './conference.component.html',
  styleUrls: ['./conference.component.scss'],
  animations: [SlideRowAnimation]
})
export class ConferenceComponent implements OnInit, AfterViewInit {

  preload: any;

  dataSource: MatTableDataSource<any>;

  displayedColumns = ['title', 'description', 'submitter'];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) table: MatTable<any>;

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
