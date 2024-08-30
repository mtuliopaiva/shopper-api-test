import { IsString, IsEmail, IsEnum, IsOptional, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUsersDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;
}
