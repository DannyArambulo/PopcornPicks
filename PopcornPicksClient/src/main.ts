import { bootstrapApplication } from '@angular/platform-browser';
import { AuthHttpInterceptor, provideAuth0 } from '@auth0/auth0-angular';

import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { LoadingInterceptor } from './app/interceptors/loader.interceptor';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { environment } from './environments/environment';
import { importProvidersFrom } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [appConfig.providers,
    provideAuth0({
      domain: environment.DOMAIN,
      clientId: environment.CLIENT_ID,
      authorizationParams: {
        audience: "https://dev-qk32cwgnciwik2to.us.auth0.com/api/v2/",
        redirect_uri: window.location.origin
      }
    }),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
    [provideRouter(routes)],
    importProvidersFrom(AuthHttpInterceptor),
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true }
  ],
  
  
});

