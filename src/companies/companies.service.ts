import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/schemas/users.interface';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { toObjectId } from 'src/utils/string';
import apiQueries from 'api-query-params';
@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private readonly companyModel: SoftDeleteModel<CompanyDocument>,
  ) {}

  async create(args: { createCompanyDto: CreateCompanyDto; user: IUser }) {
    return await this.companyModel.create({
      ...args.createCompanyDto,
      createdBy: {
        _id: args.user._id,
        email: args.user.email,
      },
    });
  }

  async findAll(args: { page: number; limit: number; search: string }) {
    const { filter, population, sort } = apiQueries(args.search);

    return await this.companyModel
      .find(filter)
      .skip((args.page - 1) * args.limit)
      .limit(args.limit)
      .sort(sort)
      .populate(population)
      .exec();
  }

  async findOne(id: string) {
    return await this.companyModel.findById(id);
  }

  async update(args: {
    id: string;
    updateCompanyDto: UpdateCompanyDto;
    user: IUser;
  }) {
    return await this.companyModel.updateOne(
      {
        _id: toObjectId(args.id),
      },
      {
        ...args.updateCompanyDto,
        updatedBy: {
          _id: toObjectId(args.user._id),
          email: args.user.email,
        },
      },
      {
        upsert: true,
      },
    );
  }

  async remove(args: { id: string; user: IUser }) {
    const [, result] = await Promise.all([
      this.companyModel.updateOne(
        { _id: toObjectId(args.id) },
        {
          deletedBy: {
            _id: toObjectId(args.user._id),
            email: args.user.email,
          },
        },
      ),
      this.companyModel.softDelete({ _id: toObjectId(args.id) }),
    ]);

    return result;
  }
}
