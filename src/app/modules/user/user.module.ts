import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { RouterModule } from '@angular/router';
import { RoleGuard } from '../../guards/role.guard';
import { UserComponent } from './user.component';
import { UserService } from '../../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { Preload, PreloadService } from '../../services/preload.service';

const SecureRoutes: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: UserComponent,
    canActivateChild: [RoleGuard],
    resolve: {
      preload: PreloadService
    },
    children: [
      {
        path: 'home',
        component: HomeComponent,
        data: {
          expectedRoles: ['ADMIN', 'REVIEWER', 'EDITOR']
        }
      },
      {path: '', pathMatch: 'full', redirectTo: 'home'}
    ]
  }
]);

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    SecureRoutes
  ],
  declarations: [
    UserComponent,
    HomeComponent
  ],
  providers: [
    RoleGuard,
    UserService,
    PreloadService
  ]
})
export class UserModule {
}
