import { Component, inject, OnInit  } from '@angular/core';
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
import { AuthService } from '@auth0/auth0-angular';
import { CommonModule } from '@angular/common';
import { AuthClientConfig } from '@auth0/auth0-angular';

@Component({
  selector: 'app-accountinfo',
  standalone: true,
  imports: [MatCardModule, MatFormField,MatLabel,MatInputModule,MatCardActions,MatButtonModule,MatCheckbox,RouterLink,RouterOutlet,CommonModule],
  templateUrl: './accountinfo.component.html',
  styleUrl: './accountinfo.component.css'
})
export class AccountinfoComponent implements OnInit{

  private auth = inject(AuthService);
  user$ = this.auth.user$;

  disableEdit: boolean = false;
  disableSave: boolean = true;
  disableCheckbox: boolean = true;
  userId: string = ""

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      if (user && user.sub) {
        this.userId = user.sub;
        //console.log('User ID:', this.userId);
      }
    });
  }

  editProfile(){
    this.disableEdit = true;
    this.disableSave = false;
    this.disableCheckbox = false;
  }

  subProfile(){
    this.disableEdit = false;
    this.disableSave = true;
    this.disableCheckbox = true;
  }

}
