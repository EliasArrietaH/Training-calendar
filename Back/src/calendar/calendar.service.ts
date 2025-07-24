import { google } from 'googleapis';
import { Injectable, HttpException } from '@nestjs/common';
import axios from 'axios';

const BASE = 'https://www.googleapis.com/calendar/v3';

@Injectable()
export class CalendarService {
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
      return res.data;
    } catch (error: any) {
      throw new HttpException(`Error creating event: ${error.message}`, 500);
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
      const res = await axios.patch(`${BASE}/calendars/primary/events/${eventId}?sendUpdates=all`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error: any) {
      throw new HttpException(`Error updating event: ${error.message}`, 500);
    }
  }

  async deleteEvent(token: string, eventId: string) {
    try {
      const res = await axios.delete(`${BASE}/calendars/primary/events/${eventId}?sendUpdates=all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error: any) {
      throw new HttpException(`Error deleting event: ${error.message}`, 500);
    }
  }
}
