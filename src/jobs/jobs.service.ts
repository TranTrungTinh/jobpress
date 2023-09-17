import {
  BadRequestException,
  Injectable,
  // NotFoundException,
} from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { IUser } from 'src/users/schemas/users.interface';
import { Job, JobDocument } from './schema/job.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, toObjectUser, toObjectId } from 'src/utils/string';
import { omit } from 'lodash';
import dayjs from 'dayjs';
import aps from 'api-query-params';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name) private jobModel: SoftDeleteModel<JobDocument>, // private readonly usersService: UsersService,
  ) {}

  async create(createJobDto: CreateJobDto, user: IUser) {
    // TODO: Validate startDate and endDate
    const startDate = dayjs(createJobDto.startDate);
    const endDate = dayjs(createJobDto.endDate);
    if (!startDate.isValid() || !endDate.isValid())
      throw new BadRequestException('Invalid date format');
    if (startDate.isAfter(endDate))
      throw new BadRequestException('Start date must be before end date');

    const createdJobInfo = await this.jobModel.create({
      ...createJobDto,
      isActive: false,
      createdBy: toObjectUser(user),
    });

    return omit(createdJobInfo.toJSON(), ['__v', 'deletedAt', 'deletedBy']);
  }

  async findAll(args: { currentPage: string; limit: string; qs: string }) {
    const { currentPage = 1, limit = 10, qs } = args;
    const { filter, sort, population } = aps(qs);

    delete filter.current;
    delete filter.pageSize;

    const [totalItems, results] = await Promise.all([
      this.jobModel.find(filter).countDocuments(),
      this.jobModel
        .find(filter)
        .skip((+currentPage - 1) * +limit)
        .limit(+limit)
        .sort(sort)
        .populate(population)
        .exec(),
    ]);

    return {
      meta: {
        current: currentPage, // this mean current page
        pageSize: limit, // this mean limit per page
        pages: Math.ceil(totalItems / +limit), // this mean total pages
        total: totalItems, // this mean total items
      },
      results, // this mean data
    };
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('Job not found');

    const jobDetail = await this.jobModel
      .findOne({
        _id: toObjectId(id),
        isDeleted: false,
      })
      .lean();

    // if (!jobDetail) throw new NotFoundException('Job not found');

    return omit(jobDetail, ['__v', 'deletedAt', 'deletedBy']);
  }

  async update(args: { id: string; updateJobDto: UpdateJobDto; user: IUser }) {
    if (!isValidObjectId(args.id))
      throw new BadRequestException('Job not found');

    const jobInfo = await this.jobModel
      .updateOne(
        {
          _id: toObjectId(args.id),
        },
        {
          ...args.updateJobDto,
          updatedBy: toObjectUser(args.user),
        },
      )
      .lean();

    return omit(jobInfo, ['__v', 'deletedAt', 'deletedBy']);
  }

  async remove(args: { id: string; user: IUser }) {
    if (!isValidObjectId(args.id))
      throw new BadRequestException('Job not found');

    const [, result] = await Promise.all([
      this.jobModel.updateOne(
        { _id: toObjectId(args.id) },
        {
          deletedBy: toObjectUser(args.user),
        },
      ),
      this.jobModel.softDelete({ _id: toObjectId(args.id) }),
    ]);

    return result;
  }
}
