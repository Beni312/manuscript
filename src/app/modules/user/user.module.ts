import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { ConferenceComponent } from './components/conference/conference.component';
import { FileDropModule } from 'ngx-file-drop';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../material/material.module';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { PersonalDataPreloadResolver } from './components/profile/personal.data.preload.resolver';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileService } from '../../services/profile.service';
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
          icon: 'home',
          place: 'sidebar'
        }
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: {
          expectedRoles: ['ADMIN', 'REVIEWER', 'EDITOR', 'AUTHOR'],
          label: 'Profile',
          icon: 'account_circle',
          place: 'sidebar'
        },
        resolve: {
          preload: PersonalDataPreloadResolver
        }
      },
      {
        path: 'conference',
        component: ConferenceComponent,
        data: {
          expectedRoles: ['REVIEWER', 'EDITOR', 'AUTHOR', 'ADMIN'],
          label: 'Conference',
          icon: 'group_work',
          place: 'sidebar'
        }
      },
      {
        path: 'submission',
        component: SubmissionComponent,
        data: {
          expectedRoles: ['REVIEWER', 'EDITOR', 'AUTHOR', 'ADMIN'],
          label: 'Submission',
          icon: 'content_paste',
          place: 'sidebar'
        },
        resolve: {
          preload: SubmissionPreloadResolver
        }
      },
      {
        path: 'submission/:id',
        component: SubmissionComponent,
        data: {
          expectedRoles: ['REVIEWER', 'EDITOR', 'AUTHOR', 'ADMIN'],
          label: 'Submission',
          icon: 'content_paste',
          place: 'submissionComponent'
        },
        resolve: {
          preload: SubmissionPreloadResolver
        }
      },
      {
        path: 'submission/conference/:id',
        component: SubmissionComponent,
        data: {
          expectedRoles: ['REVIEWER', 'EDITOR', 'AUTHOR', 'ADMIN'],
          label: 'Submission',
          icon: 'content_paste',
          place: 'submissionComponent'
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
          icon: 'group',
          place: 'sidebar'
        }
      },
      {path: '', pathMatch: 'full', redirectTo: 'home'}
    ]
  }
]);

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    FileDropModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
    SecureRoutes,
    SharedModule
  ],
  declarations: [
    ConferenceComponent,
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
