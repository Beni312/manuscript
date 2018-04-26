import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FileDropModule } from 'ngx-file-drop';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../material/material.module';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { PersonalDataPreloadResolver } from './components/profile/personal.data.preload.resolver';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileService } from '../../services/profile.service';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RoleGuard } from '../../guards/role.guard';
import { SharedModule } from '../shared/shared.module';
import { SubmissionComponent } from './components/submission/submission.component';
import { SubmissionDetailsComponent } from './components/submission/submission-details/submission.details.component';
import { SubmissionPreloadResolver } from './components/submission/submission.preload.service';
import { SubmissionService } from '../../services/submission.service';
import { UpdateAcademicDisciplinesComponent } from './components/profile/update.academic.disciplines/update.academic.disciplines.component';
import { UserComponent } from './user.component';
import { UserManagementComponent } from './components/user.management/user.management.component';
import { UserService } from '../../services/user.service';

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
          label: 'Home',
          icon: 'home'
        }
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: {
          expectedRoles: ['ADMIN', 'REVIEWER', 'EDITOR', 'AUTHOR'],
          label: 'Profile',
          icon: 'account_circle'
        },
        resolve: {
          preload: PersonalDataPreloadResolver
        }
      },
      {
        path: 'submission',
        component: SubmissionComponent,
        data: {
          expectedRoles: ['REVIEWER', 'EDITOR', 'AUTHOR'],
          label: 'Submission',
          icon: 'content_paste'
        },
        resolve: {
          preload: SubmissionPreloadResolver
        }
      },
      {
        path: 'user-management',
        component: UserManagementComponent,
        data: {
          expectedRoles: ['ADMIN'],
          label: 'User management',
          icon: 'group'
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
    FileDropModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
    SecureRoutes
  ],
  declarations: [
    HomeComponent,
    ProfileComponent,
    SubmissionComponent,
    SubmissionDetailsComponent,
    UpdateAcademicDisciplinesComponent,
    UserComponent,
    UserManagementComponent
  ],
  providers: [
    PersonalDataPreloadResolver,
    ProfileService,
    RoleGuard,
    SubmissionPreloadResolver,
    SubmissionService,
    UserService
  ],
  entryComponents: [
    UpdateAcademicDisciplinesComponent
  ]
})
export class UserModule {
}
