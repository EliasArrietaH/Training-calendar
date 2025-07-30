import { google } from 'googleapis';
import { Injectable, HttpException } from '@nestjs/common';
import axios from 'axios';
import { DatabaseService } from '../database/database.service'; // Asegúrate de que la ruta sea correcta
import { CreateEventDto } from './dto/create-event.dto';

const BASE = 'https://www.googleapis.com/calendar/v3';

@Injectable()
export class CalendarService {


    constructor(private readonly db: DatabaseService) {}


async listEvents(token: string, timeMin: string, timeMax?: string) {
    try {
      const params: any = { timeMin, singleEvents: true, orderBy: 'startTime' };
      if (timeMax) params.timeMax = timeMax;

      const res = await axios.get(`${BASE}/calendars/primary/events`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error: any) {
      throw new HttpException(`Error listing events: ${error.message}`, 500);
    }
}


async searchEvents(token: string, timeMin: string, searchTerm: string) {
    try {
      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: token });

      const calendar = google.calendar({ version: 'v3', auth });

      const res = await calendar.events.list({
        calendarId: 'primary',
        timeMin,
        q: searchTerm,
        singleEvents: true,
        orderBy: 'startTime',
      });

      const events = res.data.items || [];
      return events;
    } catch (error: any) {
      throw new HttpException(`Error searching events: ${error.message}`, 500);
    }
}


async insertEvent(token: string, body: any) {
  try {
    const res = await axios.post(`${BASE}/calendars/primary/events?sendUpdates=all`, body, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const event = res.data;

    // Guardar el evento en la base de datos
    try {
      await this.db.query(
        `INSERT INTO events (
          google_event_id, summary, location, description, start_time, end_time, attendees
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          event.id,
          event.summary || '',
          event.location || '',
          event.description || '',
          event.start.dateTime || event.start.date,
          event.end.dateTime || event.end.date,
          event.attendees ? event.attendees.map((a: any) => a.email) : [],
        ],
      );
    } catch (dbError) {
      console.error('Error guardando evento en DB:', dbError);
   
    }

    return event;
  } catch (error: any) {
    throw new HttpException(`Error creating event: ${error.message}`, 500);
  }
}


async createPrivateEvent(dto: CreateEventDto, token: string) {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: token });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  try {
    const res = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: dto.summary,
        description: dto.description,
        start: { dateTime: dto.startDateTime },
        end: { dateTime: dto.endDateTime },
        visibility: 'private',
        attendees: dto.attendees?.map(email => ({ email })) || [],
      },
    });

    return res.data;
  } catch (err: any) {
    console.error('❌ Error al crear evento privado:', err.response?.data || err.message);
    throw new HttpException('No se pudo crear el evento', 500);
  }
}


async shareCalendar(
    token: string,
    calendarId: string,
    userEmail: string,
    role: 'reader' | 'writer' | 'owner',
  ) {
    try {
      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: token });

      const calendar = google.calendar({ version: 'v3', auth });

      const res = await calendar.acl.insert({
        calendarId,
        requestBody: {
          role,
          scope: {
            type: 'user',
            value: userEmail,
          },
        },
      });

      return res.data;
    } catch (error: any) {
      throw new HttpException(`Error sharing calendar: ${error.message}`, 500);
    }
}


async patchEvent(token: string, eventId: string, body: any) {
  try {
    const res = await axios.patch(
      `${BASE}/calendars/primary/events/${eventId}?sendUpdates=all`,
      body,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    const updatedEvent = res.data;

    // Actualizar en la base de datos
    try {
      await this.db.query(
        `UPDATE events
         SET summary = $1,
             location = $2,
             description = $3,
             start_time = $4,
             end_time = $5,
             attendees = $6
         WHERE google_event_id = $7`,
        [
          updatedEvent.summary || '',
          updatedEvent.location || '',
          updatedEvent.description || '',
          updatedEvent.start.dateTime || updatedEvent.start.date,
          updatedEvent.end.dateTime || updatedEvent.end.date,
          updatedEvent.attendees ? updatedEvent.attendees.map((a: any) => a.email) : [],
          eventId,
        ],
      );
    } catch (dbError) {
      console.error('❌ Error actualizando evento en la base de datos:', dbError);
    }

    return updatedEvent;
  } catch (error: any) {
    throw new HttpException(`Error updating event: ${error.message}`, 500);
  }
}


async deleteEvent(token: string, eventId: string) {
  try {
    const res = await axios.delete(
      `${BASE}/calendars/primary/events/${eventId}?sendUpdates=all`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    // Eliminar también de la base de datos
    try {
      await this.db.query(
        `DELETE FROM events WHERE google_event_id = $1`,
        [eventId],
      );
    } catch (dbError) {
      console.error('❌ Error eliminando evento de la base de datos:', dbError);
    }

    return res.data;
  } catch (error: any) {
    throw new HttpException(`Error deleting event: ${error.message}`, 500);
  }
}
}
