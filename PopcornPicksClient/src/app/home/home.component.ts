import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, NgIf],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  welcomeMessage = 'Welcome to PopcornPicks!';
  // Replace with real user data later
  username = '';

  // Placeholder data for favorites (replace with real data later)
  favorites = [
    { title: 'Interstellar' },
    { title: 'The Dark Knight' },
    { title: 'Inception' },
    { title: 'Parasite' },
    { title: 'The Matrix' },
    { title: 'The Lord of the Rings' },
    { title: 'Shrek' },
  ];

  // Placeholder data for last watched movie (also replaced with real data later)
  lastWatched = {
    title: 'Interstellar',
    rating: 5,
    date: '2024-10-13',
  };

  constructor(private router: Router) {}

  // Navigation for 'See All' buttons
  viewFavorites() {
    // Navigate to "Favorites" page
    this.router.navigate(['/favoritesComponent']);
  }

  viewHistory() {
    // Navigate to "Watch History" page
    this.router.navigate(['/historyComponent']);
  }
}
