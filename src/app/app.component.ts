import { Component, OnInit } from '@angular/core';
import { ProgressSpinnerService } from './services/progress.spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  progressSpinnerStatus: string;

  constructor(private progressSpinnerService: ProgressSpinnerService) {
    this.progressSpinnerService.updateProgressSpinner.subscribe((mode) => {
      this.progressSpinnerStatus = mode;
    });
  }

  ngOnInit(): void {
  }

  // navLinks = [
  //   {label: 'Login', path: 'login'},
  //   {label: 'Registration', path: 'registration'}
  // ];
}
