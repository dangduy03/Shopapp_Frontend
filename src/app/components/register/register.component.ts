import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../service/user.service';
import { RegisterDTO } from '../../dtos/user/register.dto';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    FormsModule,
    NgIf,
    RouterModule,
    HttpClientModule,
    CommonModule
    // HttpClient,
    // HttpHeaders,
    // Router
    ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  @ViewChild('registerForm') registerForm! : NgForm;
  // khai báo các biến tương ứng với các trường dữ liệu trong form
  phoneNumber: string;
  password: string;
  retypePassword: string;
  fullName: string;
  address: string;
  isAccepted: boolean;
  dateOfBirth: Date;

  constructor(
    private userService: UserService,
    private router: Router
  ){
    this.phoneNumber = '';
    this.password = '';
    this.retypePassword = '';
    this.fullName = '';
    this.address = '';
    this.isAccepted = true;
    this.dateOfBirth = new Date();
    this.dateOfBirth.setFullYear(this.dateOfBirth.getFullYear() -18);
  }

  onPhoneNumberChange(){
    console.log(`Phone typed: ${this.phoneNumber}`);
    //how to valiadate ? phone must be at least 6 character
  }
  
  register() {
    const message = `phone: ${this.phoneNumber}`+
                    `password: ${this.password}`+
                    `retypePassword: ${this.retypePassword}`+
                    `address: ${this.address}`+
                    `fullName: ${this.fullName}`+
                    `isAccepted: ${this.isAccepted}`+
                    `dateOfBirth: ${this.dateOfBirth}`;
    // alert(message);
    

    const registerDTO : RegisterDTO  = {
      "fullname": this.fullName,
      "phone_number": this.phoneNumber,
      "address": this.address,
      "password": this.password,
      "retype_password": this.retypePassword,
      "date_of_birth": this.dateOfBirth,
      "facebook_account_id": 0,
      "google_account_id": 0,
      "role_id": 1
    }
    this.userService.register(registerDTO).subscribe({
      next: (response: any) => {
        
        this.router.navigate(['/login']);
      },
      complete: () => {
        
      },
      error: (error: any) => {
        // xử lý lỗi nếu có\
        console.log(error.error);
      },
    })
  }

  //how to check password mmatch ?
  checkPasswordsMMatch(){
    if (this.password !== this.retypePassword) {
      this.registerForm.form.controls['retypePassword'].setErrors({'passwordMismatch': true});
    } else {
      this.registerForm.form.controls['retyprPassword'].setErrors(null);
    }
  }

  checkAge() {

    if (this.dateOfBirth) {
      const today = new Date();
      const birtDate = new Date(this.dateOfBirth);
      let age = today.getFullYear() - birtDate.getFullYear();
      const monthDiff = today.getMonth() - birtDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birtDate.getDate())) {
        age--;
      }

      if (age < 18) {
        this.registerForm.form.controls['dateOfBirth'].setErrors({'invaliAge':true});
      } else {
        this.registerForm.form.controls['dateOfBirth'].setErrors(null);
      }
    }
  }

}
