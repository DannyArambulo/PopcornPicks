import { Component } from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatFormField} from '@angular/material/form-field';
import {MatLabel} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {merge} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { MatCardActions } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'app-accountinfo',
  standalone: true,
  imports: [MatCardModule, MatFormField,MatLabel,MatInputModule,MatCardActions,MatButtonModule,MatCheckbox,RouterLink,RouterOutlet],
  templateUrl: './accountinfo.component.html',
  styleUrl: './accountinfo.component.css'
})
export class AccountinfoComponent {

}
