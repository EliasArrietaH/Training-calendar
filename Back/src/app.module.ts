import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CalendarModule } from './calendar/calendar.module';
import { ConfigModule } from '@nestjs/config';
import { GoogleAuthModule } from './calendar/google/google-auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CalendarModule,
    GoogleAuthModule, // <-- importalo acá
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}