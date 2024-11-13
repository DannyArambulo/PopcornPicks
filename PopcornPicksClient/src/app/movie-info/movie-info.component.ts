import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';

@Component({
  selector: 'app-movie-info',
  standalone: true,
  imports: [MatCardModule, MatFormField, MatButtonModule],
  templateUrl: './movie-info.component.html',
  styleUrl: './movie-info.component.css'
})
export class MovieInfoComponent {

}
