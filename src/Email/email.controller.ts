import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { EmailData } from './email.dto';

@Controller('mail')
@ApiTags('Email') 
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  @ApiBody({ type: EmailData }) 
  async sendEmail(@Body() emailData: EmailData): Promise<Object> {
      await this.emailService.sendMail(emailData.to, emailData.subject, emailData.html);
      return {status:200, message:'Email sent successfully'};
  }
}
