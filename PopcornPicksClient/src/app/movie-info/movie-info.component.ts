import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-movie-info',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './movie-info.component.html',
  styleUrl: './movie-info.component.css'
})
export class MovieInfoComponent {

}
