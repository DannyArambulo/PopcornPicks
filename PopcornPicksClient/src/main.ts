import { bootstrapApplication } from '@angular/platform-browser';
import { provideAuth0 } from '@auth0/auth0-angular';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { LoadingInterceptor } from './app/interceptors/loader.interceptor';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [appConfig.providers,
    provideAuth0({
      domain: 'dev-qk32cwgnciwik2to.us.auth0.com',
      clientId: 'N7Eazf21KpCFCM0y4Cuk8xvLotiqEf7P',
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    }),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
    [provideRouter(routes)]
  ],
});

