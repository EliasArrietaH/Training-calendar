import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { CalendarController } from 'src/calendar/calendar.controller';

@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
