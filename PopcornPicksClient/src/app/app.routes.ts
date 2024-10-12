import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
  {path: 'logincomponent', component: LoginComponent},
  {path: 'welcomecomponent', component: WelcomeComponent},
  {path: 'registercomponent', component: RegisterComponent},
  {path: '', redirectTo: 'welcomecomponent', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes), LoginComponent, WelcomeComponent],
  exports: [RouterModule]
})
export class AppRoutingModule { }