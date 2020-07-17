import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SinginDTO, SingupDTO } from './dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('/signup')
  @UsePipes(ValidationPipe)
  async signup(@Body() signupDTO: SingupDTO): Promise<void> {
    return this._authService.singup(signupDTO);
  }

  @Post('/signin')
  @UsePipes(ValidationPipe)
  async signin(@Body() singinDTO: SinginDTO) {
    return this._authService.signin(singinDTO);
  }
}
