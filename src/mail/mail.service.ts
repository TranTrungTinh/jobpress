import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Job, JobDocument } from 'src/jobs/schema/job.schema';
import {
  Subscriber,
  SubscriberDocument,
} from 'src/subscribers/schema/subscriber.schema';
import { getSelectFields } from 'src/utils/object';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,

    @InjectModel(Subscriber.name)
    private subscriberModel: SoftDeleteModel<SubscriberDocument>,

    @InjectModel(Job.name)
    private jobModel: SoftDeleteModel<JobDocument>, // private readonly usersService: UsersService,
  ) {}

  async handleTestEmail() {
    return await this.mailerService.sendMail({
      to: 'trantrungtinh1x96@gmail.com',
      from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template: 'job',
      context: {
        receiver: 'Trung Tinh',
        sender: 'Tinh Tran',
      },
    });
  }

  // TODO: Send email to all subscribers matching the job's skill
  async handleSendEmail() {
    // TODO: Find all subscribers
    const subscribers = await this.subscriberModel
      .find({})
      .select(getSelectFields(['name', 'email', 'skill']))
      .lean();

    const mailerIterators = subscribers.map(async (subscriber) => {
      const jobsMatchingSkills = await this.jobModel
        .find({
          skill: { $in: subscriber.skill },
        })
        .select(getSelectFields(['title', 'description', 'skill', 'salary']))
        .lean();

      return this.mailerService.sendMail({
        to: subscriber.email,
        from: '"Support Team" <support@example.com>',
        subject: 'New jobs matching your skills',
        template: 'new-job',
        context: {
          receiver: subscriber.name,
          jobs: jobsMatchingSkills,
        },
      });
    });

    return await Promise.allSettled(mailerIterators);
  }
}
