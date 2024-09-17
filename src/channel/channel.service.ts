import { Injectable, Inject } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Channel } from "./channel.model";
import { GroupsService } from "src/groups/groups.service";




@Injectable()
export class channelService {
    constructor(@InjectModel(Channel) private channelModel: typeof Channel,
        @Inject(GroupsService) private readonly groupService: GroupsService) { }

    async findAll(payload) {
        const { page, limit, offset } = payload;
        const channel = await this.channelModel.findAndCountAll({
            limit: Number(limit) ? Number(limit) : 100,
            offset: Number(offset) ? Number(offset) : 0
        });
        const channelData = await this.makeEntry(channel.rows)
    return {
      data: channelData.data,
      total: channel.count,
      count: channel.count,
    };
    }


    async makeEntry(channel: Channel[]) {
        let result = [];
        for (let i = 0; i < channel.length; i++) {
            await this.groupService.findAllByChannel(channel[i].groupId)
                .then(async (group) => {
                    let groups = [];
                    if (group.length > 0) {
                        await group.forEach((ele) => {
                            groups.push(ele);
                        })
                    }

                    result.push({
                        channelId: channel[i].channelId,
                        server: channel[i].server,
                        channelName: channel[i].channelName,
                        groupId: channel[i].groupId,
                        group: groups[0]
                    })
                })
        }
        return { data: result }
    }

    async findOne(id: string): Promise<Channel> {
        return await this.channelModel.findOne({
            where: { channelId: id }
        }).then(async (channel) => {
            return this.groupService.findAllByChannel(channel.groupId)
                .then(async (group) => {
                    let groups = [];
                    if (group) {
                        await group.forEach((ele) => {
                            groups.push(ele)
                        })
                    }
                    return {
                        channelId: channel.channelId,
                        server: channel.server,
                        channelName: channel.channelName,
                        groupId: channel.groupId,
                        group: groups[0]
                    }
                }).catch((err) => {
                    return err;
                })
        }).catch((err) => {
            return err;
        })
    }

    async create(channelData: any): Promise<Channel> {
        const channel = await this.channelModel.create(channelData);
        return channel;
    }

    async remove(id: string): Promise<void> {
        await this.channelModel.destroy({ where : { channelId: id } })
    }

    async update(id: string, channelData: any): Promise<Channel> {
        const channel = await this.channelModel.findOne({
            where : { channelId: id }
        });
        return await channel.update(channelData)
    }
}