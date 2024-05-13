import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './entities/department.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';


@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository( Department)
    private  departmentRepository: Repository< Department>,
    private userService: UserService,
  ) {}

  async isUserAssociatedWithDepartment( departmentId: number, userId: number) {
    const count = await this.departmentRepository.count({
      where: { id:  departmentId, users: { id: userId } },
    });
    if (count === 0) {
      throw new UnauthorizedException('User is not associated with department');
    }

    return true;
  }

  async create(createDepartmentDto: CreateDepartmentDto, userId: number) {
    const department = new Department();
    department.name = createDepartmentDto.name;
    const user = await this.userService.findOne(userId);
    department.users = [user];
    return this.departmentRepository.save(department);
  }

  findAllByUserId(userId: number) {
    return this.departmentRepository.find({
      where: { users: { id: userId } },
      relations: ['users'],
    });
  }

  findOne(id: number, userId: number) {
    return this.departmentRepository.findOne({
      where: {
        id,
        users: { id: userId },
      },
      relations: ['users', 'swimlanes', 'swimlanes.cards'],
    });
  }

  async update(id: number, userId: number, updateDepartmentDto: UpdateDepartmentDto) {
    await this.isUserAssociatedWithDepartment(id, userId);
    return this.departmentRepository.update(id, {
      name: updateDepartmentDto.name,
    });
  }

  async remove(id: number, userId: number) {
    await this.isUserAssociatedWithDepartment(id, userId);
    return this.departmentRepository.delete(id);
  }
}