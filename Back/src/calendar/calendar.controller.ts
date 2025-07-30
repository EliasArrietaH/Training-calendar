
import { Controller, Post, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CreateEventDto } from './dto/create-event.dto';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post('list')
  async list(@Body() body: { token: string; timeMin: string; timeMax: string }) {
    return this.calendarService.listEvents(body.token, body.timeMin, body.timeMax);
  }

  @Post('search')
  async search( @Body() body: { token: string; timeMin: string; searchTerm: string },) {
  return this.calendarService.searchEvents(body.token, body.timeMin, body.searchTerm);
  }

  @Post('create')
  async create(@Body() body: { token: string; event: any }) {
    return this.calendarService.insertEvent(body.token, body.event);
  }

  
  @Post('events/private')
  async createPrivateEvent(
    @Body() dto: CreateEventDto,
    @Headers('Authorization') authHeader: string
  ) {
    const accessToken = this.extractToken(authHeader); 
    return this.calendarService.createPrivateEvent(dto, accessToken);
  }

  // Función auxiliar que limpia el token
  private extractToken(authHeader: string): string {
    if (!authHeader || !authHeader.startsWith('Bearer '))
      throw new UnauthorizedException('Token no proporcionado o mal formado');
    return authHeader.replace('Bearer ', '');
  }


   @Post('share')
  async shareCalendar(
    @Headers('authorization') authHeader: string,
    @Body() body: { calendarId: string; userEmail: string; role: 'reader' | 'writer' | 'owner' },
  ) {
    const token = authHeader?.replace('Bearer ', '');

    return await this.calendarService.shareCalendar(
      token,
      body.calendarId,
      body.userEmail,
      body.role,
    );
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
