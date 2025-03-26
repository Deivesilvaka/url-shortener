import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class CreateUrlDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsUrl()
  url: string;
}
