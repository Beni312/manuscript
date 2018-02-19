import { AuthenticationGuard } from './guards/authentication.guard';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { fakeBackendProvider } from '../helpers/fake.backend';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { RegistrationComponent } from './components/registration/registration.component';
import { UserModule } from './modules/user/user.module';
import { UserService } from './services/user.service';
import { AutocompleteMultiSelectComponent } from './components/autocomplete-multi-select/autocomplete-multi-select.component';

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
    RegistrationComponent,
    AutocompleteMultiSelectComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    UserModule,
    ROUTING
  ],
  providers: [
    AuthenticationGuard,
    UserService,

    fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
