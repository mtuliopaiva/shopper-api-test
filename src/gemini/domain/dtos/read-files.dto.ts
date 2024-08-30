import { ApiProperty } from "@nestjs/swagger";

export class ReadFilesDto {
    
    @ApiProperty({ description: 'URL of the uploaded image' })
    image_url: string;
  
    @ApiProperty({ description: 'Value of the measured consumption' })
    measure_value: number;
  
    @ApiProperty({ description: 'UUID of the measurement' })
    measure_uuid: string;
  }