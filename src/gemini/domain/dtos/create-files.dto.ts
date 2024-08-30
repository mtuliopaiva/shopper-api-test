import { ApiProperty } from '@nestjs/swagger';

export class CreateFilesDto {
  @ApiProperty({ description: 'Base64 encoded image' })
  image: string;

  @ApiProperty({ description: 'Customer code' })
  customer_code: string;

  @ApiProperty({ description: 'Date and time of the measurement' })
  measure_datetime: string;

  @ApiProperty({ description: 'Type of measurement', enum: ['WATER', 'GAS'] })
  measure_type: 'WATER' | 'GAS';
}