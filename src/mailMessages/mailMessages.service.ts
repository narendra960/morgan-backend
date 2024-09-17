import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { MailMessages } from './mailMessages.model';

@Injectable()
export class MailMessageService {
    constructor(@InjectModel(MailMessages) private mailMessageService: typeof MailMessages) { }

    async findAll(payload) {
        const { page, limit, offset } = payload;
        const types = await this.mailMessageService.findAndCountAll({
            limit: Number(limit) ? Number(limit) : 100,
            offset: Number(offset) ? Number(offset) : 0,
        });
        return { data: types.rows, total: types.count, count: types.count };
    }

    async findOne(id: string): Promise<MailMessages> {
        return this.mailMessageService.findOne({
            where: {
                mailId: id
            }
        });
    }

    async create(mailMessageData: any): Promise<MailMessages> {
        const response = await this.mailMessageService.create(mailMessageData);
        return response;
    }

    async readMail(id: string): Promise<MailMessages> {
        const groups = await this.mailMessageService.findOne({ where: { mailId: id } });
        return await groups.update({ mailRead: true });
    }

    async remove(id: string): Promise<MailMessages> {
        const groups = await this.mailMessageService.findOne({ where: { mailId: id } });
        return await groups.update({ isDeleted: true });   
    }
}

