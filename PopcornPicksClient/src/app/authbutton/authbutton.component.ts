import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button'
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
      <button mat-raised-button class="signIn" (click)="auth.loginWithRedirect({authorizationParams: {prompt: 'select_account'}})"><mat-icon>login</mat-icon>Sign In</button>
    </ng-template>
  `,
  standalone: true,
  styleUrl: './authbutton.component.css'
})

export class AuthbuttonComponent implements OnInit {

  userId: string = "";
  resUser: User | null = null;
  firsttimesetup: Number = 0;

  constructor(@Inject(DOCUMENT) public document: Document, public auth: AuthService, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.auth.getAccessTokenSilently().subscribe(token => {
      // console.log("Access Token:", token);
    }, err => {
      // console.error("Failed to retrieve token:", err);
    });
      this.auth.user$.subscribe(user => {
        if (user && user.sub) {
          this.userId = user.sub;
          //console.log('User ID:', this.userId);

          if (this.userId && this.auth.isAuthenticated$) {

            this.getUserId(this.userId);

          }
        }
      });
  }

// Adds User ID to PopcornPicks database.
  addUserId(userId: string): void {
    const apiUrl = environment.baseUrl + 'addUser';
    const headers = { 'content-type': 'text/plain'}; 
    this.http.post<String>(apiUrl, userId, {'headers': headers}).subscribe(
      response => {
         //console.log('User ID successfully sent to backend:', response);
         this.userId = <string>response
        //  console.log(this.userId)
         window.location.reload()
      },
      error => {
         //console.error('Error sending User ID to backend:', error);
      }
    );
  }

// Retrieves User ID and firstimesetup values from PopcornPicks database 
// when user logs in. If firsttimesetup == 0, the user gets taken to
// firsttimesetup page. Otherwise, user is taken to home page.
  getUserId(userID: string): void {
    const apiUrl = environment.baseUrl + 'getUser';
    const headers = { 'Content-Type': 'text/plain'}; 
    this.http.post<JSON>(apiUrl, this.userId , {'headers': headers}).subscribe(
      (response) => {
        /* console.log("This is the response:", response);
        console.log('Users successfully sent to backend:', response); */

        this.resUser = <User><unknown>response;
        this.firsttimesetup = this.resUser.firsttimesetup

        // console.log("User_ID:" + this.resUser.user_id);
        // console.log("FirstTime: " + this.firsttimesetup)
        if((this.resUser.user_id == "NULL") && (this.firsttimesetup == -1))
        {
          // console.log("Adding User")
          this.addUserId(this.userId);
        }

        else if(this.firsttimesetup == 0){
          // console.log("User already added but hasn't completed setup")
          this.firsttimesetup = 1;
          const userSet: User = {user_id: this.userId, firsttimesetup: this.firsttimesetup};
          // console.log(JSON.stringify(userSet));
          this.setUser(userSet);
          this.router.navigate(['/firsttimesetup']);
        }

        else
        {
          // console.log("Setup already done")
          this.router.navigate(['/home']);
        }

      },
      error => {
        // console.error('Error getting User to backend:', error);
      }
    );
  }

// Sends API request to update the firsttimesetup value for a User ID in the
// PopcornPicks database.
  setUser(user: User): void {
    const apiUrl = environment.baseUrl + 'setUser';
    const headers = { 'Content-Type': 'application/json'}; 
    this.http.post<JSON>(apiUrl, JSON.stringify(user) , {'headers': headers}).subscribe(
      response => {
        // console.log('firsttimesetup successfully sent to backend:', response);
      },
      error => {
        // console.error('Error sending firsttimesetup to backend:', error);
      }
    );
  }


}