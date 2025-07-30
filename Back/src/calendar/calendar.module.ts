import { Module } from '@nestjs/common';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { DatabaseModule } from 'src/database/database.module';


@Module({
   imports: [DatabaseModule],
  controllers: [CalendarController],
  providers: [CalendarService],
})
export class CalendarModule {}
