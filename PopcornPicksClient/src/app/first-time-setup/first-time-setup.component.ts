import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckbox} from '@angular/material/checkbox';
import { MatCard } from '@angular/material/card';
import { User } from '@auth0/auth0-angular';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

interface UserGenre{
  user_id: string;
  userGenres: string[];
}

@Component({
  selector: 'app-first-time-setup',
  standalone: true,
  imports: [MatButtonModule, MatStepperModule, FormsModule,
    ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatCheckbox, MatCard],
  templateUrl: './first-time-setup.component.html',
  styleUrl: './first-time-setup.component.css'
})

export class FirstTimeSetupComponent implements OnInit{

    private _formBuilder = inject(FormBuilder);
    disableEdit: boolean = false;
    disableSave: boolean = true;
    disableCheckbox: boolean = false;
    userId: string = "";
    genres: string[] = [];
    genIdArray: string[] = ["28","35","10749","27","878","12","16","80","99","18","10751","14","36","10402","9648","10770","53","10752","37"];

    constructor(private route: ActivatedRoute, private http: HttpClient, public auth: AuthService, private router: Router) {}

    ngOnInit() {
      this.auth.user$.subscribe(user => {
        if (user && user.sub) {
          this.userId = user.sub;
        }
      });
    }
  
    setGenres(): void{
      this.genres = [];
      for (var x of this.genIdArray){
        var curCheckbox = (<HTMLInputElement>document.getElementById(x+"-input"));
        if (curCheckbox.checked){
          this.genres.push(curCheckbox.value)
        }

        else;
      }

      const genreRes: UserGenre = {user_id: this.userId, userGenres: this.genres};

      this.sendGenres(genreRes);

      this.router.navigate(['/homecomponent']);
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

}
