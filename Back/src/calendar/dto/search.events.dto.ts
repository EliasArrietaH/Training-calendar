import { IsOptional, IsString } from 'class-validator';

export class SearchEventsDto {
  @IsOptional()
  @IsString()
  q?: string;
}