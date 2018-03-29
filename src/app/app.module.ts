import { AppComponent } from './app.component';
import { AuthenticationGuard } from './guards/authentication.guard';
import { BrowserModule } from '@angular/platform-browser';
import { fakeBackendProvider } from '../helpers/fake.backend';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { MaterialModule } from './modules/material/material.module';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { ProgressInterceptor, ProgressSpinnerService } from './services/progress.spinner.service';
import { RegistrationComponent } from './components/registration/registration.component';
import { SharedModule } from './modules/shared/shared.module';
import { UserModule } from './modules/user/user.module';
import { UserService } from './services/user.service';

const ROUTING: ModuleWithProviders = RouterModule.forRoot([
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'registration',
    component: RegistrationComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'login'
  }
], {
  useHash: true,
  preloadingStrategy: PreloadAllModules
});

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
    ROUTING,
    SharedModule,
    UserModule
  ],
  providers: [
    AuthenticationGuard,
    UserService,
    ProgressSpinnerService,
    {provide: HTTP_INTERCEPTORS, useClass: ProgressInterceptor, multi: true, deps: [ProgressSpinnerService]},

    fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
