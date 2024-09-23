import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Events } from '../common/enums';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(
    @Inject(EventEmitter2)
    private eventEmitter: EventEmitter2
  ){}
  @Cron('0 10 * * * *')
  handleCron() {
    this.eventEmitter.emit(Events.OnTaskStart)
    Logger.debug('============开始定时任务=============');
  }

  // @Interval(5000)
  // handleInterval() {
    
  // }

  // @Timeout(5000)
  // handleTimeout() {
  //   this.logger.debug('Called once after 5 seconds');
  //   this.deviceService.removeFilesTask()
  // }
}
