import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button'
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { MatMenuModule } from '@angular/material/menu';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { environment } from '../../environments/environment';

interface User{
  user_id: string | null;
  firsttimesetup: Number;
}

@Component({
  selector: 'app-auth-button',
  imports: [CommonModule, MatButtonModule, MatMenuModule, MatIcon],
  template: `
    <ng-container *ngIf="auth.isAuthenticated$ | async; else loggedOut">
      <button mat-menu-item color="warn" (click)="auth.logout({ logoutParams: { returnTo: document.location.origin } })">
      <mat-icon>logout</mat-icon>Sign Out
      </button>
    </ng-container>

    <ng-template #loggedOut>
      <button mat-raised-button color="primary" (click)="auth.loginWithRedirect({authorizationParams: {prompt: 'select_account'}})"><mat-icon>login</mat-icon>Sign In</button>
    </ng-template>
  `,
  standalone: true
})

export class AuthbuttonComponent implements OnInit {

  userId: string | null = null;
  resUser: User | null = null;
  firsttimesetup: Number = 0;

  constructor(@Inject(DOCUMENT) public document: Document, public auth: AuthService, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.auth.getAccessTokenSilently().subscribe(token => {
      console.log("Access Token:", token);
    }, err => {
      console.error("Failed to retrieve token:", err);
    });
      this.auth.user$.subscribe(user => {
        if (user && user.sub) {
          this.userId = user.sub;
          console.log('User ID:', this.userId);

          if (this.userId && this.auth.isAuthenticated$) {
            this.addUserId(this.userId);

            this.getUserId(this.userId);

          }
        }
      });
  }

  addUserId(userId: string): void {
    const apiUrl = environment.baseUrl + 'addUser';
    const headers = { 'content-type': 'text/plain'}; 
    this.http.post<String>(apiUrl, userId, {'headers': headers}).subscribe(
      response => {
        console.log('User ID successfully sent to backend:', response);
      },
      error => {
        console.error('Error sending User ID to backend:', error);
      }
    );
  }

  getUserId(userID: string): void {
    const apiUrl = environment.baseUrl + 'getUser';
    const headers = { 'Content-Type': 'text/plain'}; 
    this.http.post<JSON>(apiUrl, this.userId , {'headers': headers}).subscribe(
      (response) => {
        console.log("This is the response:", response);
        console.log('Users successfully sent to backend:', response);
        this.resUser = <User><unknown>response;
        this.firsttimesetup = this.resUser.firsttimesetup

        if(this.firsttimesetup == 0){
          console.log("User has not performed first time setup");
          this.firsttimesetup = 1;
          const userSet: User = {user_id: this.userId, firsttimesetup: this.firsttimesetup};
          console.log(JSON.stringify(userSet));
          this.setUser(userSet);
          this.router.navigate(['/firsttimesetupcomponent']);
        }

        else
        {
          this.router.navigate(['/homecomponent']);
        }

      },
      error => {
        console.error('Error getting User to backend:', error);
      }
    );
  }

  setUser(user: User): void {
    const apiUrl = environment.baseUrl + 'setUser';
    const headers = { 'Content-Type': 'application/json'}; 
    this.http.post<JSON>(apiUrl, JSON.stringify(user) , {'headers': headers}).subscribe(
      response => {
        console.log('firsttimesetup successfully sent to backend:', response);
      },
      error => {
        console.error('Error sending firsttimesetup to backend:', error);
      }
    );
  }


}