import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { GroupMessage } from './groupMessage.model';

@Injectable()
export class GroupMessageService {
    constructor(@InjectModel(GroupMessage) private groupMessageModel: typeof GroupMessage) { }

    async findAll(payload) {
        const { page, limit, offset } = payload;
        const types = await this.groupMessageModel.findAndCountAll({
            limit: Number(limit) ? Number(limit) : 100,
            offset: Number(offset) ? Number(offset) : 0,
        });
        return { data: types.rows, total: types.count, count: types.count };
    }

    async findOne(serverAddress: string): Promise<GroupMessage> {
        return this.groupMessageModel.findOne({
            where: {
                serverAddress: serverAddress
            }
        });
    }

    async create(groupMessageData: any): Promise<GroupMessage> {
        const groupMessage = await this.groupMessageModel.create(groupMessageData);
        return groupMessage;
    }

    async update(serverAddress: string, groupMessageData: any): Promise<GroupMessage> {
        const groupMessage = await this.groupMessageModel.findOne({ where: { serverAddress: serverAddress } });
        return await groupMessage.update(groupMessageData);
    }

    async remove(serverAddress: string): Promise<void> {
        await this.groupMessageModel.destroy({ where: { serverAddress: serverAddress } });
    }
    
}

