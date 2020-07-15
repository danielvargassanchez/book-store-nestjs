import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserDTO } from './tdo/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  // si lo haces con param retorna un objeto con una propiedad id y el dato lo tiene con string
  //usar el parseintpipe para obtener la propiedad id de params como entero
  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number): Promise<UserDTO> {
    const user = await this._userService.get(id);
    return user;
  }

  @Get()
  async getUsers(): Promise<UserDTO[]> {
    const users = await this._userService.getAll();
    return users;
  }

  @Post('create')
  async createUser(@Body() user: User): Promise<UserDTO> {
    const createdUser = await this._userService.create(user);
    return createdUser;
  }

  @Patch(':id')
  async updateUser(@Param('id', ParseIntPipe) id: number, @Body() user: User) {
    const updatedUser = await this._userService.update(id, user);
    return true;
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    await this._userService.delete(id);
    return true;
  }
}
