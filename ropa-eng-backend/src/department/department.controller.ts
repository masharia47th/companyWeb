import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { AuthGuard, PayloadRequest } from 'src/auth/auth/auth.guard';

@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createDepartmentDto: CreateDepartmentDto,
  @Request() req:PayloadRequest
) {
    return this.departmentService.create(createDepartmentDto,req.user.id);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Request() req:PayloadRequest) {
  
    return this.departmentService.findAllByUserId(req.user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string, @Request() req: PayloadRequest) {
    return this.departmentService.findOne(+id,req.user.id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Request() req: PayloadRequest, @Body() updateDepartmentDto: UpdateDepartmentDto) {
    return this.departmentService.update(+id,req.user.id, updateDepartmentDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Request() req: PayloadRequest) {
    return this.departmentService.remove(+id, req.user.id);
  }
}
