import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  {path: 'logincomponent', component: LoginComponent},
  {path: 'welcomecomponent', component: WelcomeComponent},
  {path: '', redirectTo: 'welcomecomponent', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes), LoginComponent, WelcomeComponent],
  exports: [RouterModule]
})
export class AppRoutingModule { }