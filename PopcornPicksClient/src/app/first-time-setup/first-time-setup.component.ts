import {Component, inject} from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckbox} from '@angular/material/checkbox';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-first-time-setup',
  standalone: true,
  imports: [MatButtonModule, MatStepperModule, FormsModule,
    ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatCheckbox, MatCard],
  templateUrl: './first-time-setup.component.html',
  styleUrl: './first-time-setup.component.css'
})
export class FirstTimeSetupComponent {

    private _formBuilder = inject(FormBuilder);
    disableEdit: boolean = false;
    disableSave: boolean = true;
    disableCheckbox: boolean = false;
    userId: string = ""
  
    sendGenres(): void{

    }

}
