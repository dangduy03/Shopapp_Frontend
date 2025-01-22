import {
    IsString,
    IsNotEmpty,
    IsPhoneNumber
} from 'class-validator'

export class LoginDTO {
  @IsString()
  emailOrPhoneNumber: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  constructor(data: any) {
    this.emailOrPhoneNumber = data.emailOrPhoneNumber;
    this.password = data.password;
  }
}

