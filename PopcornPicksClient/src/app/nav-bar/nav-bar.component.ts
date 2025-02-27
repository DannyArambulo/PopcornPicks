import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthbuttonComponent } from "../authbutton/authbutton.component";
import { AuthService } from '@auth0/auth0-angular';
import { NavmenuComponent } from '../navmenu/navmenu.component';
import { CommonModule } from '@angular/common';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, RouterModule, AuthbuttonComponent, NavmenuComponent, CommonModule, SearchComponent],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

  isAuthenticated = false;

  constructor(public auth: AuthService){

    this.auth.isAuthenticated$.subscribe({
      next: (isAuthenticated) => {
        this.isAuthenticated = isAuthenticated
      },
      error: (msg) => {
        console.log('error')
      }
    })

  }


    userLoggedIn(){
      if(this.isAuthenticated)
      {
        console.log("User is logged in");
        return true;
      }
        
      else
      console.log("User is logged out");
        return false;
    }

    registerAccount(){
      this.auth.loginWithRedirect({ 
        authorizationParams: {
            screen_hint: 'signup',
          }});
    }

}
