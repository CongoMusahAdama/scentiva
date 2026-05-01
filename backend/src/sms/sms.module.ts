import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SmsService } from './sms.service';
import { SmsLog, SmsLogSchema } from './sms-log.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: SmsLog.name, schema: SmsLogSchema }]),
  ],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
