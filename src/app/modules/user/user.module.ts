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
          expectedRoles: ['ADMIN', 'REVIEWER', 'EDITOR', 'USER']
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
    HomeComponent
  ],
  providers: [
    RoleGuard,
    UserService
  ]
})
export class UserModule {
}
