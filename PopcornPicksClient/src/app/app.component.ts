import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NavBarComponent } from "./nav-bar/nav-bar.component";
import { FooterComponent } from './footer/footer.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { AuthService } from '@auth0/auth0-angular';
import { AuthbuttonComponent } from "./authbutton/authbutton.component";
import { CommonModule } from '@angular/common';
import { LoadingscreenComponent } from "./loadingscreen/loadingscreen.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, RouterModule, MatToolbarModule, MatIconModule, MatButtonModule, NavBarComponent, FooterComponent, WelcomeComponent, AuthbuttonComponent, CommonModule, LoadingscreenComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'PopcornPicksClient';

  constructor(private authService: AuthService) {}

  
}
