import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button'
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { MatMenuModule } from '@angular/material/menu';
import { HttpClient } from '@angular/common/http';

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

export class AuthbuttonComponent implements OnInit {

  userId: string | null = null;

  constructor(@Inject(DOCUMENT) public document: Document, public auth: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
      this.auth.user$.subscribe(user => {
        if (user && user.sub) {
          this.userId = user.sub;
          console.log('User ID:', this.userId);

          if (this.userId) {
            this.getUserId(this.userId);
          }
        }
      });
  }

  getUserId(userId: string): void {
    const apiUrl = 'http://localhost:5000';

    this.http.post(apiUrl, { userId }).subscribe(
      response => {
        console.log('User ID successfully sent to backend:', response);
      },
      error => {
        console.error('Error sending User ID to backend:', error);
      }
    );
  }
}