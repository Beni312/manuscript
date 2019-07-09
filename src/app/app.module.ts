import { AuthenticationGuard } from './guards/authentication.guard';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from './modules/core/core.module';
import { ErrorHandler, ModuleWithProviders, NgModule } from '@angular/core';
import { GlobalErrorHandler } from './services/global.error.handler';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './modules/core/components/login/login.component';
import { MaterialModule } from './modules/material/material.module';
import { MessageService } from './services/message.service';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { ProgressInterceptor, ProgressSpinnerService } from './services/progress.spinner.service';
import { RegistrationComponent } from './modules/core/components/registration/registration.component';
import { SharedModule } from './modules/shared/shared.module';
import { ToastrModule } from 'ngx-toastr';
import { UserModule } from './modules/user/user.module';

const Routes: ModuleWithProviders = RouterModule.forRoot([
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
    AppComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    HttpClientModule,
    MaterialModule,
    Routes,
    SharedModule,
    ToastrModule.forRoot(),
    UserModule
  ],
  providers: [
    MessageService,
    ProgressSpinnerService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ProgressInterceptor,
      multi: true,
      deps: [ProgressSpinnerService]
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
