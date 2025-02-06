import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterModule,
} from '@angular/router';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { LoginDTO } from '../../dtos/user/login.dto';
import { UserService } from '../../service/user.service';
import { TokenService } from '../../service/token.service';
import { UserResponse } from '../../reponses/user/user.response';
import { ApiResponse } from '../../reponses/api.response';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastService } from '../../utils/components/toast.service';
import { ToastSeverityEnum } from '../../utils/enums/toast-serverity.enum';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  localStorage?: Storage;
  loginForm = new FormGroup({
    emailOrPhoneNumber: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('', [Validators.required]),
  });

  ngOnInit() {}
  constructor(
    private tokenService: TokenService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) {}

  onLoginFormSubmit() {
    if (this.loginForm.valid) {
      this.userService.login(this.loginForm.value as any).subscribe({
        next: (apiResponse: ApiResponse) => {
          if (apiResponse.status == 'OK') {
            this.localStorage?.setItem('user', apiResponse.data);
            this.router.navigate(['/register']);
          }
        },
        complete: () => {},
        error: (error: HttpErrorResponse) => {
          this.toastService.showToastMessage(
            ToastSeverityEnum.ERROR,
            'Login error',
            'Email/PhoneNumber or password is incorrect'
          );
          console.error(error?.error?.message ?? '');
        },
      });
    } else {
    }
  }
}
