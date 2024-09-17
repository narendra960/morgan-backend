import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { SequelizeModule } from '@nestjs/sequelize';
import { MailMessages } from './mailMessages.model';
import { MailMessageService } from './mailMessages.service';

@Module({
    imports: [SequelizeModule.forFeature([MailMessages])],
    providers: [MailMessageService],
    exports: [SequelizeModule, MailMessageService]
})
export class MailMessageModule {}