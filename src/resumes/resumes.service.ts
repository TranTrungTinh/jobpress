import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Resume, ResumeDocument } from './schemas/resume.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/schemas/users.interface';
import { isValidObjectId, toObjectId, toObjectUser } from 'src/utils/string';
import { omit } from 'lodash';
import aps from 'api-query-params';

@Injectable()
export class ResumesService {
  constructor(
    @InjectModel(Resume.name)
    private readonly resumeModel: SoftDeleteModel<ResumeDocument>,
  ) {}

  async create(args: { createResumeDto: CreateResumeDto; user: IUser }) {
    const { email, _id } = args.user;
    const { jobId, companyId } = args.createResumeDto;

    if (!isValidObjectId(jobId) || !isValidObjectId(companyId))
      throw new BadRequestException('Invalid job or company id');

    // TODO: Create new resume
    const resumeInfo = await this.resumeModel.create({
      ...args.createResumeDto,
      email,
      userId: _id,
      history: [
        {
          status: 'PENDING',
          updateAt: new Date(),
          updatedBy: toObjectUser(args.user),
        },
      ],
      status: 'PENDING',
      createdBy: toObjectUser(args.user),
    });

    return omit(resumeInfo.toJSON(), ['__v', 'deletedAt', 'deletedBy']);
  }

  async findAll(args: { currentPage: string; limit: string; qs: string }) {
    const { currentPage = 1, limit = 10, qs } = args;
    const { filter, sort, population } = aps(qs);

    delete filter.current;
    delete filter.pageSize;

    const [totalItems, results] = await Promise.all([
      this.resumeModel.find(filter).countDocuments(),
      this.resumeModel
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
    if (!isValidObjectId(id)) throw new BadRequestException('resume not found');

    const resumeDetail = await this.resumeModel
      .findOne({
        _id: toObjectId(id),
        isDeleted: false,
      })
      .lean();

    return omit(resumeDetail, ['__v', 'deletedAt', 'deletedBy']);
  }

  async getResumeByUser(user: IUser) {
    const results = await this.resumeModel
      .find({
        userId: toObjectId(user._id),
        isDeleted: false,
      })
      .select({
        __v: 0,
        deletedAt: 0,
        deletedBy: 0,
      })
      .exec();

    return results;
  }

  async update(args: {
    id: string;
    updateResumeDto: UpdateResumeDto;
    user: IUser;
  }) {
    if (!isValidObjectId(args.id))
      throw new BadRequestException('resume not found');

    const resumeInfo = await this.resumeModel
      .updateOne(
        {
          _id: toObjectId(args.id),
        },
        {
          $push: {
            history: {
              status: args.updateResumeDto.status,
              updateAt: new Date(),
              updatedBy: toObjectUser(args.user),
            },
          },
          $set: {
            ...args.updateResumeDto,
            updatedBy: toObjectUser(args.user),
          },
        },
      )
      .lean();

    return omit(resumeInfo, ['__v', 'deletedAt', 'deletedBy']);
  }

  async remove(args: { id: string; user: IUser }) {
    if (!isValidObjectId(args.id))
      throw new BadRequestException('resume not found');

    const [, result] = await Promise.all([
      this.resumeModel.updateOne(
        { _id: toObjectId(args.id) },
        {
          $set: {
            deletedBy: toObjectUser(args.user),
          },
        },
      ),
      this.resumeModel.softDelete({ _id: toObjectId(args.id) }),
    ]);

    return result;
  }
}
