import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { HistoryComponent } from './history/history.component';
import { FirstTimeSetupComponent } from './first-time-setup/first-time-setup.component';
import { SearchComponent } from './search/search.component';
import { AccountinfoComponent } from './accountinfo/accountinfo.component';
import { SearchResultsComponent } from './searchresults/searchresults.component';
import { MovieInfoComponent } from './movie-info/movie-info.component';
import { RecommendComponent } from './recommend/recommend.component';
import { LoadingscreenComponent } from './loadingscreen/loadingscreen.component';


export const routes: Routes = [
  {path: 'welcome', component: WelcomeComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'home', component: HomeComponent }, 
  {path: 'history', component: HistoryComponent }, 
  {path: 'firsttimesetup', component: FirstTimeSetupComponent }, 
  {path: 'search', component: SearchComponent }, 
  {path: 'accountinfo', component: AccountinfoComponent }, 
  {path: 'searchresults', component: SearchResultsComponent },
  {path: 'movie', component: MovieInfoComponent}, 
  {path: 'recommend', component: RecommendComponent},
  {path: '', redirectTo: 'welcome', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes), WelcomeComponent, LoadingscreenComponent],
  exports: [RouterModule]
})
export class AppRoutingModule { }