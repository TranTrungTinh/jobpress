import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { Subscriber, SubscriberDocument } from './schema/subscriber.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { getSelectFields } from 'src/utils/object';
import aps from 'api-query-params';
import { isValidObjectId, toObjectId, toObjectUser } from 'src/utils/string';
import { IUser } from 'src/users/schemas/users.interface';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectModel(Subscriber.name)
    private subscriberModel: SoftDeleteModel<SubscriberDocument>,
  ) {}

  async create(createSubscriberDto: CreateSubscriberDto) {
    // TODO: if email already exists then update the subscriber
    const filter = { email: createSubscriberDto.email };
    const update = createSubscriberDto;
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    return await this.subscriberModel
      .findOneAndUpdate(filter, update, options)
      .lean()
      .select(getSelectFields(['_id', 'name', 'email', 'skill']));
  }

  async findAll(args: { currentPage: string; limit: string; qs: string }) {
    const { currentPage = 1, limit = 10, qs } = args;
    const { filter, sort, population } = aps(qs);

    delete filter.current;
    delete filter.pageSize;

    const [totalItems, results] = await Promise.all([
      this.subscriberModel.find(filter).countDocuments(),
      this.subscriberModel
        .find(filter)
        .skip((+currentPage - 1) * +limit)
        .limit(+limit)
        .sort(sort)
        .populate(population)
        .select(getSelectFields(['_id', 'name', 'email', 'skill']))
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
    // TODO: Check mongoose object id
    if (!isValidObjectId(id))
      throw new NotFoundException('Subscriber not found');
    return await this.subscriberModel
      .findById(id)
      .lean()
      .select(getSelectFields(['_id', 'name', 'email', 'skill']));
  }

  async update(args: {
    updateSubscriberDto: UpdateSubscriberDto;
    user: IUser;
  }) {
    return await this.subscriberModel
      .updateOne(
        {
          email: args.user.email,
        },
        {
          $set: {
            ...args.updateSubscriberDto,
            updatedBy: toObjectUser(args.user),
          },
        },
        {
          upsert: true,
        },
      )
      .lean();
  }

  async remove(args: { id: string; user: IUser }) {
    if (!isValidObjectId(args.id))
      throw new BadRequestException('Subscriber not found');

    const [, result] = await Promise.all([
      this.subscriberModel.updateOne(
        { _id: toObjectId(args.id) },
        {
          deletedBy: toObjectUser(args.user),
        },
      ),
      this.subscriberModel.softDelete({ _id: toObjectId(args.id) }),
    ]);

    return result;
  }

  async getSkills(user: IUser) {
    return await this.subscriberModel
      .findOne({ email: user.email })
      .lean()
      .select(getSelectFields(['skill']));
  }
}
