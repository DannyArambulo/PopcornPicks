import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService 
{
  private loadStatus = new BehaviorSubject<boolean>(false);

  loading$ = this.loadStatus.asObservable()

  // loadValue = this.loadStatus.subscribe((loadValue: boolean) => console.log('Observable emitted the next value: ' + loadValue))

  constructor() { }

// Starts loading screen.
  loadingStart()
  {
    // console.log("Turning ON Loading");
    this.loadStatus.next(true);
  }

// Stops loading screen.
  loadingStop()
  {
    // console.log("Turning OFF Loading");
    this.loadStatus.next(false);
  }
  
}
