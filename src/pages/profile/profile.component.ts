import { Component, ViewChild, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidationErrors,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';
import { UpdateUserDTO } from '../../dtos/user/update.user.dto';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { UserResponse } from '../../reponses/user/user.response';
import { UserService } from '../../service/user.service';
import { TokenService } from '../../service/token.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  userResponse?: UserResponse;
  profileForm: FormGroup;
  token: string = '';
  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private tokenService: TokenService
  ) {
    this.profileForm = this.formBuilder.group(
      {
        fullname: [''],
        address: ['', [Validators.minLength(3)]],
        password: ['', [Validators.minLength(3)]],
        retype_password: ['', [Validators.minLength(3)]],
        date_of_birth: [Date.now()],
      },
      {
        validators: this.passwordMatchValidator, // Custom validator function for password match
      }
    );
  }

  ngOnInit(): void {
    this.token = this.tokenService.getToken();
    this.userService.getUserDetail(this.token).subscribe({
      next: (response: any) => {
        this.userResponse = {
          ...response,
          date_of_birth: new Date(response.date_of_birth),
        };
        this.profileForm.patchValue({
          fullname: this.userResponse?.fullname ?? '',
          address: this.userResponse?.address ?? '',
          date_of_birth: this.userResponse?.date_of_birth
            .toISOString()
            .substring(0, 10),
        });
        this.userService.saveUserResponseToLocalStorage(this.userResponse);
      },
      complete: () => { },
      error: (error: HttpErrorResponse) => {
        console.error(error?.error?.message ?? '');
      },
    });
  }

  passwordMatchValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get('password')?.value;
      const retypedPassword = formGroup.get('retype_password')?.value;
      if (password !== retypedPassword) {
        return { passwordMismatch: true };
      }

      return null;
    };
  }
  save(): void {
    if (this.profileForm.valid) {
      const updateUserDTO: UpdateUserDTO = {
        fullname: this.profileForm.get('fullname')?.value,
        address: this.profileForm.get('address')?.value,
        password: this.profileForm.get('password')?.value,
        retype_password: this.profileForm.get('retype_password')?.value,
        date_of_birth: this.profileForm.get('date_of_birth')?.value,
      };

      this.userService.updateUserDetail(this.token, updateUserDTO).subscribe({
        next: (response: any) => {
          this.userService.removeUserFromLocalStorage();
          this.tokenService.removeToken();
          this.router.navigate(['/login']);
        },
        error: (error: HttpErrorResponse) => {
          console.error(error?.error?.message ?? '');
        },
      });
    } else {
      if (this.profileForm.hasError('passwordMismatch')) {
        console.error('Mật khẩu và mật khẩu gõ lại chưa chính xác');
      }
    }
  }

  backToProfile(): void {
    this.router.navigate(['/user-profile']);
  }
}
