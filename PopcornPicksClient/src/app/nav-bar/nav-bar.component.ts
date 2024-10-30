import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthbuttonComponent } from "../authbutton/authbutton.component";

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, RouterOutlet, RouterModule, AuthbuttonComponent],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

}
