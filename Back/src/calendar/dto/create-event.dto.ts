import { IsString, IsArray, IsOptional, IsDateString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  summary: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  startDateTime: string;

  @IsDateString()
  endDateTime: string;

  @IsOptional()
  @IsArray()
  attendees?: string[];
  startDate: any;
}
