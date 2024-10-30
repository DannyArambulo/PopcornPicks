import { bootstrapApplication } from '@angular/platform-browser';
import { provideAuth0 } from '@auth0/auth0-angular';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [appConfig.providers,
    provideAuth0({
      domain: 'dev-qk32cwgnciwik2to.us.auth0.com',
      clientId: 'N7Eazf21KpCFCM0y4Cuk8xvLotiqEf7P',
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    }),
  ]
});