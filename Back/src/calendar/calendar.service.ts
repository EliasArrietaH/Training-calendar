// calendar.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';

const BASE = 'https://www.googleapis.com/calendar/v3';

@Injectable()
export class CalendarService {
  async listEvents(token: string, timeMin: string, timeMax: string) {
    const res = await axios.get(`${BASE}/calendars/primary/events`, {
      params: { timeMin, timeMax, singleEvents: true, orderBy: 'startTime' },
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }

  async insertEvent(token: string, body: any) {
    const res = await axios.post(`${BASE}/calendars/primary/events?sendUpdates=all`, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }

  async patchEvent(token: string, eventId: string, body: any) {
    const res = await axios.patch(`${BASE}/calendars/primary/events/${eventId}?sendUpdates=all`, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }

  async deleteEvent(token: string, eventId: string) {
    const res = await axios.delete(`${BASE}/calendars/primary/events/${eventId}?sendUpdates=all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
}
