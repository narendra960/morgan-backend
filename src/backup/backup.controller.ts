import {
  Controller,
  Post,
  Body,
  Get,
  Res,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { AwsBackupService } from './backup.service';
@Controller('aws-backup')
export class AwsBackupController {
  constructor(private readonly awsBackupService: AwsBackupService) {}

  @Get('/back')
  async downloadBackup(@Res() res: any) {
    try {
      const backupFile = await this.awsBackupService.getDb();
      res.download(backupFile, 'a.sql', (err) => {
        if (err) {
          console.log('ddsfsdg', err);
          res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .send('Error sending file');
        } else {
          this.awsBackupService.deleteBackup(backupFile); // Clean up the file after sending
        }
      });
    } catch (error) {
      throw new HttpException(
        'Error creating backup',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/create-backup')
  createBackup() {
    // }, //   iamRoleArn: string; //   resourceArn: string; //   vaultName: string; // backupData: { // @Body()
    return this.awsBackupService.createBackup(
      'gameapioldrecover',
      'arn:aws:rds:ap-southeast-2:830495358763:db:gameapioldrecover',
      'arn:aws:iam::830495358763:user/cronj-test',
    );
  }

  @Post('/restore-db')
  async restoreDatabase(
    @Body()
    requestBody: {
      recoveryPointArn: string;
      targetDBInstanceIdentifier: string;
      instanceClass: string;
      licenseModel: string;
      VPCsecurityGroupID: string;
    },
  ): Promise<string> {
    const {
      recoveryPointArn,
      targetDBInstanceIdentifier,
      instanceClass,
      licenseModel,
      VPCsecurityGroupID,
    } = requestBody;

    try {
      await this.awsBackupService.restoreDatabase(
        recoveryPointArn,
        targetDBInstanceIdentifier,
        instanceClass,
        licenseModel,
        VPCsecurityGroupID,
      );
      return 'Restore operation initiated successfully.';
    } catch (error) {
      return `Error initiating restore operation: ${error.message}`;
    }
  }
}
