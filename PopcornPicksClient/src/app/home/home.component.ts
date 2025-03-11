import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router } from '@angular/router';
import { WatchHistoryService, WatchHistoryItem } from '../watch-history/watch-history.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  mostRecentFavorites: WatchHistoryItem[] = [];
  mostRecentWatched: WatchHistoryItem[] = [];

  constructor(private watchHistoryService: WatchHistoryService, private router: Router) {}

  ngOnInit(): void {
    this.watchHistoryService.loadWatchHistory();
    this.watchHistoryService.getWatchHistory().subscribe((history) => {
      this.mostRecentWatched = history.slice(0, 10);
      this.mostRecentFavorites = history.filter((item) => item.favorite).slice(0, 10);
    });
  }

  // Navigation for 'See All' buttons
  viewFavorites() {
    // Navigate to "Favorites" page
    this.router.navigate(['/historycomponent'], {queryParams: { filter: 'favorites'} });
  }

  viewHistory() {
    // Navigate to "Watch History" page
    this.router.navigate(['/historycomponent']);
  }
}