import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CalendarModule } from './calendar/calendar.module';
import { ConfigModule } from '@nestjs/config';
import { GoogleAuthModule } from './calendar/google/google-auth.module';
import { DatabaseService } from './database/database.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CalendarModule,
    GoogleAuthModule, 
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}