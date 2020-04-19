import { messageReducer } from '../../store/message/MessageReducer';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { ConferenceComponent } from './components/conference/conference.component';
import { ConferenceDetailsComponent } from './components/conference/conference-details/conference-details.component';
import { ConferencePreloadResolver } from './components/conference/conference.preload.resolver';
import { ConferenceService } from './components/conference/conference.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../material/material.module';
import { MessagesComponent } from './components/messages/messages.component';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { PersonalDataPreloadResolver } from './components/profile/personal.data.preload.resolver';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileService } from '../../services/profile.service';
import { RouterModule } from '@angular/router';
import { RoleGuard } from '../../guards/role.guard';
import { SharedModule } from '../shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { SubmissionComponent } from './components/submission/submission.component';
import { SubmissionUpsertComponent } from './components/submission/submission.upsert/submission.upsert.component';
import { SubmissionDetailsComponent } from './components/submission/submission-details/submission.details.component';
import { SubmissionPreloadResolver } from './components/submission/submission.preload.service';
import { SubmissionService } from '../../services/submission.service';
import { TagInputModule } from 'ngx-chips';
import { UpdateAcademicDisciplinesComponent } from './components/profile/update.academic.disciplines/update.academic.disciplines.component';
import { UserComponent } from './user.component';
import { UserManagementComponent } from './components/user.management/user.management.component';
import { UserService } from '../../services/user.service';
import { SubmissionEvaluateComponent } from './components/submission/submission.evaluate/submission.evaluate.component';
import { ManuscriptUploadModalComponent } from './components/submission/manuscript-upload-modal/manuscript-upload-modal.component';
import { NgxFileDropModule } from 'ngx-file-drop';

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
        },
        resolve: {
          preload: ConferencePreloadResolver
        }
      },
      {
        path: 'conference/:id',
        component: ConferenceComponent,
        data: {
          expectedRoles: ['REVIEWER', 'EDITOR', 'AUTHOR', 'ADMIN'],
          label: 'Conference',
          icon: 'group_work',
          place: 'conferenceComponent'
        },
        resolve: {
          preload: ConferencePreloadResolver
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
      {
        path: 'messages',
        component: MessagesComponent,
        data: {
          expectedRoles: ['REVIEWER', 'EDITOR', 'AUTHOR', 'ADMIN'],
          label: 'Messages',
          icon: 'message',
          place: 'header'
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
    NgxFileDropModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
    SecureRoutes,
    SharedModule,
    TagInputModule,
    StoreModule.forRoot({}),
    StoreModule.forFeature('message', messageReducer)
  ],
  declarations: [
    ConferenceComponent,
    HomeComponent,
    ProfileComponent,
    SubmissionComponent,
    SubmissionDetailsComponent,
    SubmissionEvaluateComponent,
    SubmissionUpsertComponent,
    UpdateAcademicDisciplinesComponent,
    UserComponent,
    UserManagementComponent,
    ConferenceDetailsComponent,
    MessagesComponent,
    ManuscriptUploadModalComponent
  ],
  providers: [
    PersonalDataPreloadResolver,
    ProfileService,
    RoleGuard,
    SubmissionPreloadResolver,
    SubmissionService,
    UserService,
    ConferencePreloadResolver,
    ConferenceService
  ]
})
export class UserModule {
}
