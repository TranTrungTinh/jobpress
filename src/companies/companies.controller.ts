import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { User } from 'src/decorator/global';
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
  findAll() {
    return this.companiesService.findAll();
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
