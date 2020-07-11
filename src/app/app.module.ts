import { AuthenticationGuard } from './guards/authentication.guard';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from './modules/core/core.module';
import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { HttpErrorInterceptor } from './services/http.error.interceptor';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtInterceptor } from './services/jwt.interceptor';
import { LoginComponent } from './modules/core/components/login/login.component';
import { MaterialModule } from './modules/material/material.module';
import { MessageService } from './services/message.service';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { ProgressInterceptor, ProgressSpinnerService } from './services/progress.spinner.service';
import { RegistrationComponent } from './modules/core/components/registration/registration.component';
import { SharedModule } from './modules/shared/shared.module';
import { SocketService } from './services/socket.service';
import { ToastrModule } from 'ngx-toastr';
import { UserModule } from './modules/user/user.module';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { systemDataReducer, SystemDataState } from './store/system-data/SystemDataReducer';
import { SystemDataService } from './services/system-data.service';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

export function systemDataProviderFactory(systemDataService: SystemDataService) {
  return (): Promise<void> => systemDataService.initSystemData();
}

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
    UserModule,
    StoreModule.forRoot({}),
    StoreModule.forFeature('systemData', systemDataReducer),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      // logOnly: environment.production, // Restrict extension to log-only mode
    })
  ],
  providers: [{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'fill'}},
    MessageService,
    SocketService,
    ProgressSpinnerService,
    {
      provide: APP_INITIALIZER,
      useFactory: systemDataProviderFactory,
      deps: [SystemDataService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ProgressInterceptor,
      multi: true,
      deps: [ProgressSpinnerService]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
