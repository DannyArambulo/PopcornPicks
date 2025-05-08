import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '@auth0/auth0-angular';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [RouterModule, MatButtonModule, MatIcon],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {
  constructor(private auth: AuthService){

  }

// Sends User to the Universal Login page from Auth0
  registerAccount(){
    this.auth.loginWithRedirect({ 
      authorizationParams: {
          screen_hint: 'signup',
        }});
      }
}
