import { Repository, EntityRepository, getConnection } from 'typeorm';
import { User } from '../user/user.entity';
import { SinginDTO, SingupDTO } from './dto';
import { RoleRepository } from '../role/role.repository';
import { Role } from '../role/role.entity';
import { RoleType } from '../role/roletype.enum';
import { UserDetails } from '../user/user.details.entity';
import { genSalt, hash } from 'bcryptjs';

@EntityRepository(User)
export class AuthRepository extends Repository<User> {
  async singUp(singUpDTO: SingupDTO) {
    const { username, password, email } = singUpDTO;
    const user = new User();

    user.username = username;
    user.email = email;

    const roleRepository: RoleRepository = await getConnection().getRepository(
      Role,
    );

    const defaultRole: Role = await roleRepository.findOne({
      where: { name: RoleType.GENERAL },
    });

    user.roles = [defaultRole];

    // crea un objeto tipo details vacío pero en la bd crea el objeto con todo null pero con id
    const details = new UserDetails();
    user.details = details;

    // sucesión de bits aleatorios para crear el hash de la contraseña
    const salt = await genSalt(10);
    user.password = await hash(password, salt);

    //guardamos el usuario creado
    await user.save();
  }
}
