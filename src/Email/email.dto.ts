import { ApiProperty } from '@nestjs/swagger';

export class EmailData {
  @ApiProperty()
  to: string;

  @ApiProperty()
  subject: string;

  @ApiProperty()
  html: string;
}
