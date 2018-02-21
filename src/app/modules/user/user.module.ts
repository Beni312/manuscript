import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RoleGuard } from '../../guards/role.guard';
import { UserComponent } from './user.component';
import { UserService } from '../../services/user.service';
import { MaterialModule } from '../material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProfileComponent } from './components/profile/profile.component';
import { SubmissionComponent } from './components/submission/submission.component';

const SecureRoutes: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: UserComponent,
    canActivateChild: [RoleGuard],
    children: [
      {
        path: 'home',
        component: HomeComponent,
        data: {
          expectedRoles: ['ADMIN', 'REVIEWER', 'EDITOR', 'AUTHOR'],
          label: 'Home'
        }
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: {
          expectedRoles: ['ADMIN', 'REVIEWER', 'EDITOR', 'AUTHOR'],
          label: 'Profile'
        }
      },
      {
        path: 'submission',
        component: SubmissionComponent,
        data: {
          expectedRoles: ['ADMIN', 'REVIEWER', 'EDITOR', 'AUTHOR'],
          label: 'Submission'
        }
      },
      {path: '', pathMatch: 'full', redirectTo: 'home'}
    ]
  }
]);

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    SecureRoutes
  ],
  declarations: [
    UserComponent,
    HomeComponent,
    ProfileComponent,
    SubmissionComponent
  ],
  providers: [
    RoleGuard,
    UserService
  ]
})
export class UserModule {
}
