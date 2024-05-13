import { Injectable } from '@nestjs/common';
import { CreateSwimlaneDto } from './dto/create-swimlane.dto';
import { UpdateSwimlaneDto } from './dto/update-swimlane.dto';
import { Swimlane } from './entities/swimlane.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { ReordereSwimlaneDto } from './dto/reorder-swimlane.dto';

@Injectable()
export class SwimlaneService {
  constructor(
    @InjectRepository(Swimlane)
    private swimlaneRepository: Repository<Swimlane>,
    private userService: UserService,
  ) {}

  async create(createSwimlaneDto: CreateSwimlaneDto, userId: number) {
    const swimlane = new Swimlane();
    swimlane.name = createSwimlaneDto.name;
    swimlane.order = createSwimlaneDto.order;
    swimlane.departmentId = createSwimlaneDto.departmentId;

    await this.userService.isConnectedToDepartment(userId, swimlane.departmentId);
    return this.swimlaneRepository.save(swimlane);
  }

  async updateSwimlaneOrders(reorder: ReordereSwimlaneDto, userId: number) {
    await this.userService.isConnectedToDepartment(userId, reorder.departmentId);

    const promises = reorder.items.map((swimlane) =>
      this.swimlaneRepository.update(swimlane.id, { order: swimlane.order }),
    );

    await Promise.all(promises);

    return true;
  }

  async hasAccessToSwimlane(swimlaneId: number, userId: number) {
    const hasAccess = await this.swimlaneRepository.count({
      where: {
        id: swimlaneId,
        department: { users: { id: userId } },
      },
    });

    return hasAccess > 0;
  }

  findAllByDepartmentId(departmentId: number, userId: number) {
    return this.swimlaneRepository.find({
      where: {
        departmentId,
        department: { users: { id: userId } },
      },
    });
  }

  async update(
    id: number,
    userId: number,
    updateSwimlaneDto: UpdateSwimlaneDto,
  ) {
    await this.userService.isConnectedToDepartment(
      userId,
      updateSwimlaneDto.departmentId,
    );
    return this.swimlaneRepository.update(id, {
      name: updateSwimlaneDto.name,
    });
  }

  async remove(id: number, userId: number) {
    await this.userService.isConnectedToSwimlane(userId, id);
    return this.swimlaneRepository.delete(id);
  }
}
