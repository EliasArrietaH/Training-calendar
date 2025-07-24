import { IsString, IsObject } from 'class-validator';

export class UpdateEventDto {
  @IsString()
  token: string;

  @IsString()
  eventId: string;

  @IsObject()
  event: Record<string, any>;
}