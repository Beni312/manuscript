import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  navLinks = [
    {label: 'Login', path: 'login'},
    {label: 'Registration', path: 'registration'}
  ]
}
