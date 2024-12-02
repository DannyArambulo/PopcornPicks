import { Component, inject, OnInit  } from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatFormField} from '@angular/material/form-field';
import {MatLabel} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {merge} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { MatCardActions } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatCheckbox } from '@angular/material/checkbox';
import { AppState, AuthService, User } from '@auth0/auth0-angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthClientConfig } from '@auth0/auth0-angular';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

interface ResGenre{
  userGenres: string[];
}

interface UserGenre{
  user_id: string;
  userGenres: string[];
}

@Component({
  selector: 'app-accountinfo',
  standalone: true,
  imports: [MatCardModule, MatFormField,MatLabel,MatInputModule,MatCardActions,MatButtonModule,MatCheckbox,RouterLink,RouterOutlet,CommonModule],
  templateUrl: './accountinfo.component.html',
  styleUrl: './accountinfo.component.css'
})
export class AccountinfoComponent implements OnInit{
  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}
  auth = inject(AuthService);
  user$ = this.auth.user$;

  disableEdit: boolean = false;
  disableSave: boolean = true;
  disableCheckbox: boolean = true;
  userId: string = "";
  genres: string[] = [];
  genResponse: ResGenre = {userGenres: []};
  genIdArray: string[] = ["28","35","10749","27","878","12","16","80","99","18","10751","14","36","10402","9648","10770","53","10752","37"];
  

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      if (user && user.sub) {
        this.userId = user.sub;
        //console.log('User ID:', this.userId);
      }

      this.getGenres();
    });
  }

  getGenres(): void {
    this.genres = []
    const apiUrl = 'http://localhost:5000/getGenre';
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
  }

  setChecks(inputGenres: string[]): void {
    console.log("The input Genres are:")
    console.log(inputGenres);
    console.log("Total number of elements: ", 
      inputGenres.length);
    for (let x of inputGenres){
      let checkbox = (<HTMLInputElement>document.getElementById(x+"-input"));
      console.log(checkbox)
      checkbox.checked=true;
    }
  }

  setGenres(): void{
    this.genres = [];
    for (var x of this.genIdArray){
      var curCheckbox = (<HTMLInputElement>document.getElementById(x+"-input"));
      if (curCheckbox.checked){
        console.log(curCheckbox.value)
        this.genres.push(curCheckbox.value)
      }

      else;
    }

    const genreRes: UserGenre = {user_id: this.userId, userGenres: this.genres};

    this.sendGenres(genreRes);
  }

  sendGenres(userInfo: UserGenre){
    const apiUrl = 'http://localhost:5000/setGenre';
    const headers = { 'Content-Type': 'application/json'}; 
    this.http.post<JSON>(apiUrl, JSON.stringify(userInfo), {'headers': headers}).subscribe(
    response => {
      console.log('Genres successfully sent to backend:', response);
    },
    error => {
      console.error('Error sending Genres to backend:', error);
    }
  );
  }

  editProfile(){
    this.disableEdit = true;
    this.disableSave = false;
    this.disableCheckbox = false;
  }

  subProfile(){
    this.disableEdit = false;
    this.disableSave = true;
    this.disableCheckbox = true;
    this.setGenres();
  }

}
