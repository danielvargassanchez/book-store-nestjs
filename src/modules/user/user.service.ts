import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { MapperService } from '../../shared/mapper.service';
import { UserDTO } from './tdo/user.dto';
import { User } from './user.entity';
import { UserDetails } from './user.details.entity';
import { getConnection } from 'typeorm';
import { Role } from '../role/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly _userRepository: UserRepository,
    private readonly _mapperService: MapperService,
  ) {}

  async get(id: number): Promise<UserDTO> {
    if (!id) {
      throw new BadRequestException('id must be sent');
    }

    const user: User = await this._userRepository.findOne(id, {
      where: { status: 'ACTIVE' },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return this._mapperService.map<User, UserDTO>(user, new UserDTO());
  }

  async getAll(): Promise<UserDTO[]> {
    const users: User[] = await this._userRepository.find({
      where: { status: 'ACTIVE' },
    });

    return this._mapperService.mapCollection<User, UserDTO>(
      users,
      new UserDTO(),
    );
  }

  async create(user: User): Promise<UserDTO> {
    const details = new UserDetails();
    user.details = details;

    const repo = await getConnection().getRepository(Role);
    const defaultRole = await repo.findOne({ where: { name: 'GENERAL' } });
    user.roles = [defaultRole];

    const savedUser: User = await this._userRepository.save(user);
    return this._mapperService.map<User, UserDTO>(savedUser, new UserDTO());
  }

  async update(id: number, user: User): Promise<void> {
    await this._userRepository.update(id, user);
  }

  async delete(id: number): Promise<void> {
    const userExist = await this._userRepository.findOne(id, {
      where: { status: 'ACTIVE' },
    });

    if (!userExist) {
      throw new NotFoundException();
    }
    await this._userRepository.update(id, { status: 'INACTIVE' });
  }
}
