import { Component} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatListModule, MatCheckboxModule, FormsModule, ReactiveFormsModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent {
  filter = 'all';

  // Temporary list of watched movies (placeholder data)
  history = [
    {
      title: 'Inception',
      rating: 5,
      dateWatched: '2024-10-01',
      poster: '',
      favorite: false
    },
    {
      title: 'Interstellar',
      rating: 4,
      dateWatched: '2024-10-05',
      poster: '',
      favorite: true
    },
    {
      title: 'The Matrix',
      rating: 5,
      dateWatched: '2024-09-29',
      poster: '',
      favorite: false
    }
  ];

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (params['filter']) {
        this.filter = params['filter']; // Set the filter from query params
      }
    });
  }
  
  // Filter movies based on the selected filter
  watchedMovies() {
    if (this.filter === 'favorites') {
      return this.history.filter((movie) => movie.favorite);
    }
    // Show all movies if filter is set to 'all'
    return this.history; 
  }

  // Toggle the favorite status of a movie
  toggleFavorite(index: number) {
    this.history[index].favorite = !this.history[index].favorite;
  }
}
