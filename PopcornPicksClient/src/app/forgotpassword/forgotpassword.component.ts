import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule, MatCardActions } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgotpassword',
  standalone: true,
  imports: [MatCardModule, MatFormField, MatLabel, MatInputModule, FormsModule, ReactiveFormsModule, MatCardActions, MatButtonModule, RouterLink],
  templateUrl: './forgotpassword.component.html',
  styleUrl: './forgotpassword.component.css'
})
export class ForgotpasswordComponent {

}
