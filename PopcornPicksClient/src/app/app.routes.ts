import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { HistoryComponent } from './history/history.component';
import { FirstTimeSetupComponent } from './first-time-setup/first-time-setup.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { SearchComponent } from './search/search.component';
import { AccountinfoComponent } from './accountinfo/accountinfo.component';
import { SearchResultsComponent } from './searchresults/searchresults.component';


export const routes: Routes = [
  {path: 'logincomponent', component: LoginComponent},
  {path: 'welcomecomponent', component: WelcomeComponent},
  {path: 'registercomponent', component: RegisterComponent},
  {path: 'homecomponent', component: HomeComponent }, 
  {path: 'historycomponent', component: HistoryComponent }, 
  {path: 'firsttimesetupcomponent', component: FirstTimeSetupComponent }, 
  {path: 'forgotpasswordcomponent', component: ForgotpasswordComponent },
  {path: 'searchcomponent', component: SearchComponent }, 
  {path: 'accountinfocomponent', component: AccountinfoComponent }, 
  {path: 'searchresults', component: SearchResultsComponent }, 
  {path: '', redirectTo: 'welcomecomponent', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes), LoginComponent, WelcomeComponent],
  exports: [RouterModule]
})
export class AppRoutingModule { }