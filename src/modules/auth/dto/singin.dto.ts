import { IsNotEmpty, IsString } from 'class-validator';

export class SinginDTO {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
