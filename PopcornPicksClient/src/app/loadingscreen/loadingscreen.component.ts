import { Component, Input } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Observable, tap } from 'rxjs';
import { LoaderService } from './loader.service';
import { NavigationEnd, NavigationStart, RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loadingscreen',
  standalone: true,
  imports: [MatProgressSpinnerModule, CommonModule, NgIf],
  templateUrl: './loadingscreen.component.html',
  styleUrl: './loadingscreen.component.css'
})
export class LoadingscreenComponent {
  loading$: Observable<boolean>;
  loadValue: boolean | undefined;

  @Input()
  detectRouteTransition = false;

  constructor(private loadingService: LoaderService, private router: Router)
  {
    this.loading$ = this.loadingService.loading$;
  }

  ngOnInit()
  {
    console.log("LoadingScreenComponent REACHED!!!");
    if(this.detectRouteTransition)
    {
      console.log("Detected RouteTransition!!!");
      this.router.events.pipe
      (
        tap
        (
          (event) => 
          {
            if(event instanceof RouteConfigLoadStart)
            {
              console.log("RouteConfigLoadStart!!!");
              this.loadingService.loadingStart();
            }

            else if (event instanceof RouteConfigLoadEnd)
            {
              console.log("RouteConfigLoadStop!!!");
              this.loadingService.loadingStop();
            }
          }
        )
      ).subscribe();
    }
  }
}
