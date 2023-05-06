import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, Length, IsString } from 'class-validator';

export class SignInUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 20, {
    message: `$constraint1到constraint2 $value`,
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20, {
    message: `$constraint1到constraint2 $value`,
  })
  password: string;
}

export class TestDto {
  @IsString()
  @IsNotEmpty()
  @Expose()
  password: string;

  @IsString()
  msg: string;

  @IsString()
  id: string;
}

export class PublicDto {
  @Expose()
  msg: string;
}
