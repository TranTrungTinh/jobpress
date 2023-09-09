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
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ResponseMessage, User } from 'src/decorator/global';
import { IUser } from 'src/users/schemas/users.interface';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  async create(
    @Body() createCompanyDto: CreateCompanyDto,
    @User() user: IUser,
  ) {
    return await this.companiesService.create({ createCompanyDto, user });
  }

  @Get()
  @ResponseMessage('Get all companies')
  async findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('qs') search: string,
  ) {
    return await this.companiesService.findAll({
      page,
      limit,
      search,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.companiesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @User() user: IUser,
  ) {
    return await this.companiesService.update({
      id,
      updateCompanyDto,
      user,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @User() user: IUser) {
    return await this.companiesService.remove({ id, user });
  }
}
