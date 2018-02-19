import { Component, OnInit } from '@angular/core';
import { Preload } from '../../services/preload.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  private preload: Preload;

  constructor(private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.preload = this.activatedRoute.snapshot.data['preload'];
    console.log(this.preload);
  }

}
