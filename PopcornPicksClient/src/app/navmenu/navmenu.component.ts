import {Component, inject} from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { AuthService } from '@auth0/auth0-angular';
import { MatIcon } from '@angular/material/icon';
import { AuthbuttonComponent } from '../authbutton/authbutton.component';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-navmenu',
  standalone: true,
  imports: [MatMenuModule, MatButtonModule, MatIcon, AuthbuttonComponent, RouterModule, RouterOutlet],
  templateUrl: './navmenu.component.html',
  styleUrl: './navmenu.component.css'
})
export class NavmenuComponent {
  private auth = inject(AuthService);
  user$ = this.auth.user$;
}
