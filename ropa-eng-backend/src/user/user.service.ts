import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from 'src/auth/dto/register.dto';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(createUserDto: RegisterDto) {
    const user = new User();
    user.email = createUserDto.email;
    user.firstName = createUserDto.firstName;
    user.secondName = createUserDto.secondName;
    user.password = createUserDto.password;
    return this.userRepository.save(user);
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  async isConnectedToDepartment(id: number, departmentId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
        department: {
          id: departmentId,
        },
      },
      relations: ['departments'],
    });

    if (!user) {
      throw new UnauthorizedException('You are not a part of this department.');
    }

    return true;
  }

  async isConnectedToSwimlane(id: number, swimlaneId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
        department: {
          swimlanes: {
            id: swimlaneId,
          },
        },
      },
      relations: ['departments', 'departments.swimlanes'],
    });

    if (!user) {
      throw new UnauthorizedException('You are not a part of this department.');
    }

    return true;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, {
      firstName: updateUserDto.firstName,
      secondName: updateUserDto.secondName,
    });
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
