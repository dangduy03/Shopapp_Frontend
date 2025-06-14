import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../service/user.service';
import { RegisterDTO } from '../../dtos/user/register.dto';
import { ApiResponse } from '../../reponses/api.response';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, ButtonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  @ViewChild('registerForm') registerForm!: NgForm;
  // Khai báo các biến tương ứng với các trường dữ liệu trong form
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  password: string;
  retypePassword: string;
  isAccepted: boolean;
  dateOfBirth: Date;
  showPassword: boolean = false;

  constructor(private router: Router, private userService: UserService) {
    this.fullName = '';
    this.phoneNumber = '';
    this.email = '';
    this.address = '';
    this.password = '';
    this.retypePassword = '';
    this.isAccepted = true;
    this.dateOfBirth = new Date();
    this.dateOfBirth.setFullYear(this.dateOfBirth.getFullYear() - 18);
  }

  onPhoneNumberChange() {
    console.log(`Phone typed: ${this.phoneNumber}`);
    //how to validate ? phone must be at least 6 characters
  }

  register() {
    const message =
      `fullName: ${this.fullName}` +
      `phone: ${this.phoneNumber}` +
      `email: ${this.email}` +
      `address: ${this.address}` +
      `password: ${this.password}` +
      `retypePassword: ${this.retypePassword}` +
      `isAccepted: ${this.isAccepted}` +
      `dateOfBirth: ${this.dateOfBirth}`;
    //console.error(message);
    // debugger;

    const registerDTO: RegisterDTO = {
      "fullname": this.fullName,
      "phone_number": this.phoneNumber,
      "email": this.email,
      "address": this.address,
      "password": this.password,
      "retype_password": this.retypePassword,
      "date_of_birth": this.dateOfBirth,
      "facebook_account_id": 0,
      "google_account_id": 0,
      "role_id": 1,
    };

    this.userService.register(registerDTO).subscribe({
      next: (apiResponse: ApiResponse) => {
        // debugger;
        const confirmation = window.confirm(
          'Đăng ký thành công, mời bạn đăng nhập. Bấm "OK" để chuyển đến trang đăng nhập.'
        );
        if (confirmation) {
          this.router.navigate(['/login']);
        }
      },
      complete: () => {
        // debugger;
      },
      error: (error: HttpErrorResponse) => {
        // debugger;
        console.error(error?.error?.message ?? '');
      },
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  //how to check password match ?
  checkPasswordsMatch() {
    if (this.password !== this.retypePassword) {
      this.registerForm.form.controls['retypePassword'].setErrors({
        passwordMismatch: true,
      });
    } else {
      this.registerForm.form.controls['retypePassword'].setErrors(null);
    }
  }

  checkAge() {
    if (this.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(this.dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      if (age < 18) {
        this.registerForm.form.controls['dateOfBirth'].setErrors({
          invalidAge: true,
        });
      } else {
        this.registerForm.form.controls['dateOfBirth'].setErrors(null);
      }
    }
  }
}

