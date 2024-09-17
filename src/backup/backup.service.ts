import { Injectable, Res, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { join } from 'path';
const { exec } = require('child_process');
import { unlink } from 'fs/promises';
// Example command to run mysqldump
const host = process.env.DATABASE_HOST;
const user = process.env.DATABASE_USER;
const password = process.env.DATABASE_PASSWORD;
const database = process.env.DATABASE_NAME;

@Injectable()
export class AwsBackupService {
  private backupClient: AWS.Backup;
  private rds: AWS.RDS;

  constructor() {
    AWS.config.update({
      accessKeyId: process.env.aws_secret_access_key,
      secretAccessKey: process.env.aws_secret_key_id,
      region: process.env.aws_region,
    });

    this.backupClient = new AWS.Backup();
    this.rds = new AWS.RDS();
  }

  private getTimestamp(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
  }
  async getDb() {
    const timestamp = this.getTimestamp();
    const fileaa = `backup_${timestamp}.sql`;
    console.log('---', fileaa);
    const dumpCommand = `mysqldump -h ${host} -u ${user} -p${password} ${database} > ${fileaa}`;
    await exec(dumpCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);

        return;
      }

      if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return;
      }

      console.log('Database backup successfully created.');
    });

    return fileaa;
  }
  async deleteBackup(filePath: any): Promise<void> {
    try {
      await unlink(filePath);
    } catch (error) {
      console.error('Error deleting backup file', error);
    }
  }
  async createBackup(
    vaultName: string,
    resourceArn: string,
    iamRoleArn: string,
  ) {
    const backupParams = {
      BackupVaultName: vaultName, // Specify the name of the backup vault
      ResourceArn: resourceArn, // ARN of the RDS instance
      IamRoleArn: iamRoleArn, // Ensure you have a role with the necessary permissions
      // Add additional parameters as necessary
    };

    try {
      const result = await this.backupClient
        .startBackupJob(backupParams)
        .promise();
      return result;
    } catch (error) {
      console.error('Failed to start backup job:', error);
      throw error;
    }
  }

  async restoreDatabase(
    recoveryPointArn: string,
    targetDBInstanceIdentifier: string,
    instanceClass: string,
    licenseModel: string,
    VPCsecurityGroupID: string,
  ): Promise<void> {
    try {
      // Start the restore job
      const restoreJobParams: AWS.Backup.StartRestoreJobInput = {
        RecoveryPointArn: recoveryPointArn,
        Metadata: {
          TargetDBInstanceIdentifier: targetDBInstanceIdentifier,
          DBInstanceClass: instanceClass, // Specify your desired instance class
          Engine: 'mysql', // Specify your RDS engine type
          PubliclyAccessible: 'true', // Set to true if you want the DB instance to be publicly accessible
          MultiAZ: 'false', // Set to true if you want to enable Multi-AZ deployment
          AutoMinorVersionUpgrade: 'true', // Set to true to enable auto minor version upgrade
          LicenseModel: licenseModel, // Specify the license model for the DB instance
          StorageType: 'gp2', // Specify the storage type for the DB instance
          StorageEncrypted: 'true', // Set to true if you want to enable storage encryption
          VpcSecurityGroupIds: VPCsecurityGroupID, // Specify the security group(s) for the DB instance
          // Tags: [{ Key: 'Name', Value: 'RestoredDBInstance' }], // Specify any tags you want to add to the DB instance
        },
        IamRoleArn:
          'arn:aws:iam::863952532221:role/service-role/AWSBackupDefaultServiceRole', // Specify the IAM role ARN for AWS Backup service to use
        ResourceType: 'RDS', // Specify the resource type to be restored (RDS in this case)
      };

      const restoreJobResponse = await this.backupClient
        .startRestoreJob(restoreJobParams)
        .promise();
      console.log('Restore job started:', restoreJobResponse);

      // Wait for the restore job to complete
      await this.waitForRestoreJobCompletion(restoreJobResponse.RestoreJobId);

      console.log('Restore operation completed successfully.');
    } catch (error) {
      console.error('Error restoring database:', error);
      throw error;
    }
  }

  private async waitForRestoreJobCompletion(
    restoreJobId: string,
  ): Promise<void> {
    try {
      let status = '';

      // Poll the restore job status every 10 seconds until it's completed
      do {
        const describeRestoreJobParams: AWS.Backup.DescribeRestoreJobInput = {
          RestoreJobId: restoreJobId,
        };

        const describeRestoreJobResponse = await this.backupClient
          .describeRestoreJob(describeRestoreJobParams)
          .promise();
        status = describeRestoreJobResponse.Status;

        console.log(`Restore job status: ${status}`);

        if (status !== 'COMPLETED' && status !== 'ABORTED') {
          await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait for 10 seconds before polling again
        }
      } while (status !== 'COMPLETED' && status !== 'ABORTED');

      if (status === 'ABORTED') {
        throw new Error('Restore job was aborted.');
      }
    } catch (error) {
      console.error('Error waiting for restore job completion:', error);
      throw error;
    }
  }
}
