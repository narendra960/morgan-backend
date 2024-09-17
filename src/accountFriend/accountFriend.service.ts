import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryTypes } from 'sequelize';
import { AccountFriend } from './accountFriend.model';
import { UserService } from '../user/user.service';
import { AccountFriendResponseDTO } from './accountFriend.dto';

@Injectable()
export class AccountFriendService {
  constructor(
    @InjectModel(AccountFriend)
    private accountFriendModel: typeof AccountFriend,
    private readonly userService: UserService,
  ) {}

  async findAll(payload) {
    const { page, limit, offset } = payload;
    const types = await this.accountFriendModel.findAndCountAll({
      limit: limit ? Number(limit) : 10,
      offset: offset ? Number(offset) : 0,
    });

    const data: AccountFriendResponseDTO[] = types.rows.map((row) => ({
      accountFriendId: row.accountFriendId,
      userId: row.userId,
      Friends: row.Friends,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }));

    return { data, total: types.count, count: types.count };
  }

  async findByUserId(id: string): Promise<AccountFriendResponseDTO> {
    const data = await this.accountFriendModel.findOne({
      where: {
        accountFriendId: id, // Use userId instead of accountFriendId
      },
    });
  
    if (!data) {
      throw new NotFoundException('AccountFriend not found');
    }
  
    const friendData: AccountFriendResponseDTO = {
      accountFriendId: data.accountFriendId,
      userId: data.userId,
      Friends: data.Friends,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  
    return friendData;
  }

  async create(accountFriendData: any): Promise<AccountFriend> {
    const { userId, Friends } = accountFriendData;

    // Check if userId is a valid user ID
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new BadRequestException('Invalid userId.');
    }

    // Check if Friends is an array of valid user IDs
    if (!Array.isArray(Friends) || !Friends.every((id) => typeof id === 'string')) {
      throw new BadRequestException('Invalid format for the Friends field.');
    }

    // Check if each friend ID in the Friends array is a valid user ID
    for (const friendId of Friends) {
      const friend = await this.userService.findOne(friendId);
      if (!friend) {
        throw new BadRequestException('Invalid friendId.');
      }
    }

    const accountFriend = await this.accountFriendModel.create({
      userId,
      Friends,
    });
    return accountFriend;
  }

  // async update(id: string, entryTagData: any): Promise<EntryTag> {
  //   const user = await this.entryTagModel.findOne({
  //     where: { etId: id },
  //   });
  //   return await user.update(entryTagData);
  // }

  async update(id: string, accountFriendData: any): Promise<AccountFriend> {
    const accountFriend = await this.accountFriendModel.findOne({
      where: { accountFriendId: id },
    });

    if (!accountFriend) {
      throw new NotFoundException('AccountFriend not found');
    }

    // Check if the provided userId exists in the User table
    const user = await this.userService.findOne(accountFriendData.userId);
    if (!user) {
      throw new BadRequestException('Invalid userId');
    }

    // Check if the provided Friends array contains valid user IDs
    const friends = accountFriendData.Friends;
    if (!Array.isArray(friends) || !friends.every((friendId) => this.isValidUserId(friendId))) {
      throw new BadRequestException('Invalid Friends array');
    }

    // Update the accountFriend with the new data
    return await accountFriend.update({
      userId: accountFriendData.userId,
      Friends: accountFriendData.Friends,
    });
  }

  // Helper method to check if a given user ID exists in the User table
  private async isValidUserId(userId: string): Promise<boolean> {
    const user = await this.userService.findOne(userId);
    return !!user;
  }

  async remove(id: string): Promise<void> {
    const accountFriend = await this.accountFriendModel.findByPk(id);
    if (!accountFriend) {
      throw new NotFoundException('AccountFriend not found');
    }
    
    await accountFriend.destroy();
  }
}
