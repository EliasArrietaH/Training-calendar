// calendar.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { CalendarService } from './calendar.service';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post('list')
  async list(@Body() body: { token: string; timeMin: string; timeMax: string }) {
    return this.calendarService.listEvents(body.token, body.timeMin, body.timeMax);
  }

  @Post('create')
  async create(@Body() body: { token: string; event: any }) {
    return this.calendarService.insertEvent(body.token, body.event);
  }

  @Post('update')
  async update(@Body() body: { token: string; eventId: string; event: any }) {
    return this.calendarService.patchEvent(body.token, body.eventId, body.event);
  }

  @Post('delete')
  async delete(@Body() body: { token: string; eventId: string }) {
    return this.calendarService.deleteEvent(body.token, body.eventId);
  }
}
