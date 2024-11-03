import { Component, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button'
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-auth-button',
  imports: [CommonModule, MatButtonModule, NavBarComponent, MatMenuModule],
  template: `
    <ng-container *ngIf="auth.isAuthenticated$ | async; else loggedOut">
      <button mat-menu-item color="warn" (click)="auth.logout({ logoutParams: { returnTo: document.location.origin } })">
        Log out
      </button>
    </ng-container>

    <ng-template #loggedOut>
      <button mat-raised-button color="primary" (click)="auth.loginWithRedirect()">Log in</button>
    </ng-template>
  `,
  standalone: true
})
export class AuthbuttonComponent {
  constructor(@Inject(DOCUMENT) public document: Document, public auth: AuthService) {}
}