import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ResponseMessage, User } from 'src/decorator/global';
import { IUser } from 'src/users/schemas/users.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Resumes')
@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  @ResponseMessage('Create resume successfully')
  create(@Body() createResumeDto: CreateResumeDto, @User() user: IUser) {
    return this.resumesService.create({ createResumeDto, user });
  }

  @Get()
  @ResponseMessage('Fetch resumes with pagination successfully')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query('qs') qs: string,
  ) {
    return this.resumesService.findAll({ currentPage, limit, qs });
  }

  @Get(':id')
  @ResponseMessage('Resume found successfully')
  async findOne(@Param('id') id: string) {
    return await this.resumesService.findOne(id);
  }

  @Post('by-user')
  @ResponseMessage('Resume found successfully')
  async getResumeByUser(@User() user: IUser) {
    return await this.resumesService.getResumeByUser(user);
  }

  @Patch(':id')
  @ResponseMessage('Resume updated successfully')
  async update(
    @Param('id') id: string,
    @Body() updateResumeDto: UpdateResumeDto,
    @User() user: IUser,
  ) {
    return await this.resumesService.update({ id, updateResumeDto, user });
  }

  @Delete(':id')
  @ResponseMessage('Resume deleted successfully')
  async remove(@Param('id') id: string, @User() user: IUser) {
    return await this.resumesService.remove({ id, user });
  }
}
