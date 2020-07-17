import { createParamDecorator } from '@nestjs/common';
import { UserDTO } from '../user/tdo/user.dto';

export const GetUser = createParamDecorator(
  (data, req): UserDTO => {
    return req.user;
  },
);
