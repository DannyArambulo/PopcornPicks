import { Component, inject, OnInit  } from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatFormField} from '@angular/material/form-field';
import {MatLabel} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService} from '@auth0/auth0-angular';
import { CommonModule } from '@angular/common';
import { AuthClientConfig } from '@auth0/auth0-angular';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';

// interface ResGenre{
//   userGenres: string[];
// }

// interface UserGenre{
//   user_id: string;
//   userGenres: string[];
// }

@Component({
  selector: 'app-accountinfo',
  standalone: true,
  imports: [MatCardModule, MatFormField,MatLabel,MatInputModule,MatButtonModule,CommonModule],
  templateUrl: './accountinfo.component.html',
  styleUrl: './accountinfo.component.css'
})
export class AccountinfoComponent implements OnInit{
  constructor(
    private http: HttpClient, 
    private authConfig: AuthClientConfig,
    private snackBar: MatSnackBar
  ) {}

  auth = inject(AuthService);
  user$ = this.auth.user$;

  disableEdit: boolean = false;
  disableSave: boolean = true;
  disableCheckbox: boolean = true;
  disableResetPassword: boolean = true;
  userId: string = "";
  passMessage: string = "";
  genres: string[] = [];
  // genResponse: ResGenre = {userGenres: []};
  genIdArray: string[] = ["28","35","10749","27","878","12","16","80","99","18","10751","14","36","10402","9648","10770","53","10752","37"];
  

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      if (user && user.sub) {
        this.userId = user.sub;
        //console.log('User ID:', this.userId);
        this.enablePassChange();
      }

    });
  }

  // Makes request for Auth0 to send an email to currently logged in user that 
  // allows user to change password. 
  changePassword(): void {
    this.user$.subscribe(user => {
      if (user && user.email) {
        const domain = this.authConfig.get().domain;
        const clientId = this.authConfig.get().clientId;
        const resetPasswordUrl = `https://${domain}/dbconnections/change_password`;
  
        const payload = {
          client_id: clientId,
          email: user.email,
          connection: 'Username-Password-Authentication'
        };
  
        this.http.post(resetPasswordUrl, payload, { 
          headers: { 'Content-Type': 'application/json' },
          responseType: 'text' 
        })
          .subscribe(
            (response) => {
              console.log('Password reset email sent successfully:', response);
              this.snackBar.open('A password reset email has been sent to your email.', 'Close', {
                duration: 5000,
              });
            },
            (error) => {
              console.error('Error sending password reset email:', error);
              this.snackBar.open('Failed to send password reset email. Please try again.', 'Close', {
                duration: 5000,
              });
            }
          );
      } else {
        console.error('User email not found');
      }
    });
  }
  

/*   getGenres(): void {
    this.genres = []
    const apiUrl = environment.baseUrl + 'getGenre';
    const headers = { 'Content-Type': 'text/plain'}; 
    this.http.post<JSON>(apiUrl, this.userId , {'headers': headers}).subscribe(
      (response) => {
        console.log("This is the response:", response);
        console.log('Genres successfully sent to backend:', response);
        this.genResponse = <ResGenre><unknown>response;
        this.genres = this.genResponse.userGenres
        this.setChecks(this.genres);
      },
      error => {
        console.error('Error sending Genres to backend:', error);
      }
    );
  } */

  // setChecks(inputGenres: string[]): void {
  //   /* console.log("The input Genres are:")
  //   console.log(inputGenres);
  //   console.log("Total number of elements: ", 
  //     inputGenres.length); */
  //   for (let x of inputGenres){
  //     let checkbox = (<HTMLInputElement>document.getElementById(x+"-input"));
  //     // console.log(checkbox)
  //     checkbox.checked=true;
  //   }
  // }

  // setGenres(): void{
  //   this.genres = [];
  //   for (var x of this.genIdArray){
  //     var curCheckbox = (<HTMLInputElement>document.getElementById(x+"-input"));
  //     if (curCheckbox.checked){
  //       // console.log(curCheckbox.value)
  //       this.genres.push(curCheckbox.value)
  //     }

  //     else;
  //   }

  //   const genreRes: UserGenre = {user_id: this.userId, userGenres: this.genres};

  //   this.sendGenres(genreRes);
  // }

  // sendGenres(userInfo: UserGenre){
  //   const apiUrl = environment.baseUrl + 'setGenre';
  //   const headers = { 'Content-Type': 'application/json'}; 
  //   this.http.post<JSON>(apiUrl, JSON.stringify(userInfo), {'headers': headers}).subscribe(
  //   response => {
  //     // console.log('Genres successfully sent to backend:', response);
  //   },
  //   error => {
  //     // console.error('Error sending Genres to backend:', error);
  //   }
  // );
  // }

  // editProfile(){
  //   this.disableEdit = true;
  //   this.disableSave = false;
  //   this.disableCheckbox = false;
  // }

// Checks to see if user logged in with SSO or not. If not logged in SSO, enables reset
// password button. If user is logged in SSO, disables reset password button and gives
// message on why button is disabled.
  enablePassChange()
  {
    if (this.userId.startsWith("auth0"))
    {
      this.disableResetPassword = false;
      this.passMessage = ""
    }

    else
    {
      this.disableResetPassword = true;
      this.passMessage = "Password change unnecessary with SSO account."
    }
  }

  // subProfile(){
  //   this.disableEdit = false;
  //   this.disableSave = true;
  //   this.disableCheckbox = true;
  //   this.setGenres();
  // }

}
