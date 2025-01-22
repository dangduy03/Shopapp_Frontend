import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
} from '@angular/forms';
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
import { ToastService } from '../../utils/components/toast/toast.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  emailOrPhoneNumber: string;
  password: string;
  // loginForm = new FormGroup({
  //   emailOrPhoneNumber: new FormControl(''),
  //   password: new FormControl(''),
  // });

  // loginData: LoginDTO = {
  //   emailOrPhoneNumber: this.loginForm.value.emailOrPhoneNumber ?? '',
  //   password: this.loginForm.value.password ?? '',
  // };

  // localStorage?: Storage;
  // userResponse?: UserResponse;

  constructor() {
    (this.emailOrPhoneNumber = ''), (this.password = '');
  } // private toastService: ToastService // // private tokenService: TokenService, // private userService: UserService, // // private activatedRoute: ActivatedRoute, // private router: Router,

  ngOnInit() {}

  // handleLogin() {
  //   console.log('dsgfakdsfadshfgjadshfgsfas');
  //   if (this.loginForm.valid) {
  //     this.userService.login(this.loginData).subscribe({
  //       next: (apiResponse: ApiResponse) => {
  //         if (apiResponse.status == 'OK') {
  //           this.localStorage?.setItem('user', apiResponse.data);
  //           this.router.navigate(['/register']);
  //         }
  //       },
  //       complete: () => {},
  //       error: (error: HttpErrorResponse) => {
  //         this.toastService.show(
  //           'Lỗi đăng nhập: Tên đăng nhập hoặc mật khẩu không đúng !',
  //           'bg-danger text-light'
  //         );
  //         console.error(error?.error?.message ?? '');
  //       },
  //     });
  //   } else {
  //     this.toastService.show(
  //       'Vui lòng kiểm tra đầy đủ thông tin nhập vào !',
  //       'bg-danger text-light'
  //     );
  //   }
  // }
  onSubmit(): void {
    alert(this.emailOrPhoneNumber);
  }
}
