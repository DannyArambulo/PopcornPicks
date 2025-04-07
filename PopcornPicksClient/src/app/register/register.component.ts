import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, NgIf],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.minLength(6)]);
  confirmPassword = new FormControl('', [Validators.required]);

  errorMessage: string = '';

  registerForm = new FormGroup({
    email: this.email,
    password: this.password,
    confirmPassword: this.confirmPassword,
  });

  constructor() {
    merge(this.email.statusChanges, this.password.statusChanges, this.confirmPassword.statusChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  updateErrorMessage() {
    this.errorMessage = '';

    if (this.email.invalid) {
      if (this.email.hasError('required')) {
        this.errorMessage = 'You must enter a value for email';
      } else if (this.email.hasError('email')) {
        this.errorMessage = 'Not a valid email';
      }
    } else if (this.password.invalid) {
      if (this.password.hasError('required')) {
        this.errorMessage = 'You must enter a password';
      } else if (this.password.hasError('minlength')) {
        this.errorMessage = 'Password must be at least 6 characters long';
      }
    } else if (this.confirmPassword.invalid) {
      if (this.confirmPassword.hasError('required')) {
        this.errorMessage = 'You must confirm your password';
      }
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      // console.log('Registration Successful:', this.registerForm.value);
      // Handle registration logic here
    } else {
      // console.log('Registration form is invalid');
    }
  }
}
