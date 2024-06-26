import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Card } from './entities/card.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from 'src/department/entities/department.entity';
import { ReorderedCardDto } from './dto/reorder-cards.dto';
import { UserService } from 'src/user/user.service';
import { SwimlaneService } from 'src/swimlane/swimlane.service';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
    private swimlaneService: SwimlaneService,
    private userService: UserService,
  ) {}

  async create(createCardDto: CreateCardDto, userId: number) {
    const card = new Card();
    card.name = createCardDto.name;
    card.description = createCardDto.description;
    card.swimlaneId = createCardDto.swimlaneId;
    card.order = createCardDto.order;
    const hasAccessToSwimlane = await this.swimlaneService.hasAccessToSwimlane(
      createCardDto.swimlaneId,
      userId,
    );
    if (!hasAccessToSwimlane) {
      throw new UnauthorizedException('You are not a part of this board.');
    }
    return this.cardRepository.save(card);
  }

  async updateCardOrdersAndSwimlanes(
    reorder: ReorderedCardDto,
    userId: number,
  ) {
    await this.userService.isConnectedToDepartment(userId, reorder.boardId);

    const promises = reorder.cards.map((card) =>
      this.cardRepository.update(card.id, {
        order: card.order,
        swimlaneId: card.swimlaneId,
      }),
    );

    await Promise.all(promises);

    return true;
  }

  async update(id: number, userId: number, updateCardDto: UpdateCardDto) {
    await this.userService.isConnectedToSwimlane(
      userId,
      updateCardDto.swimlaneId,
    );
    return this.cardRepository.update(id, {
      name: updateCardDto.name,
      description: updateCardDto.description,
    });
  }

  async remove(id: number, userId: number) {
    const card = await this.cardRepository.findOneBy({ id });
    await this.userService.isConnectedToSwimlane(userId, card.swimlaneId);
    return this.cardRepository.delete(id);
  }
}
