import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { AwsBackupService } from './backup.service';

@Module({
  imports: [AwsBackupService],
  providers: [AwsBackupService],
  exports: [AwsBackupService],
})
export class AwsBackupModule {}
