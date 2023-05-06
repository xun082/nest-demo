import { IsNotEmpty } from 'class-validator';

export class GithubLoginDto {
  @IsNotEmpty({ message: '请输入授权码' })
  code: string;
}
