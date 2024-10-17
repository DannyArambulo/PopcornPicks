import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  // placeholder data for search results
  searchResults = [
    {
      title: 'Inception',
      poster: ''
    },
    {
      title: 'Interstellar',
      poster: ''
    },
    {
      title: 'The Matrix',
      poster: ''
    }
  ];
}
