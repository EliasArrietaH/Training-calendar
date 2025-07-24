import { IsString } from 'class-validator';

export class SearchEventsDto {
  @IsString()
  token: string;

  @IsString()
  timeMin: string;

  @IsString()
  searchTerm: string;
}