import { AuthenticationGuard } from '../../guards/authentication.guard';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { MaterialModule } from '../material/material.module';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistrationComponent } from './components/registration/registration.component';
import { SharedModule } from '../shared/shared.module';
import { UserService } from '../../services/user.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  declarations: [
    LoginComponent,
    RegistrationComponent
  ],
  providers: [
    AuthenticationGuard,
    UserService,
  ]
})
export class CoreModule {
}
