import { Injectable, NotFoundException  } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Token } from './token.model';

@Injectable()
export class TokenService {
  constructor(@InjectModel(Token) private tokenModel: typeof Token) {}

  async findAll(payload) {
    const { page, limit, offset } = payload;
    const tokens = await this.tokenModel.findAndCountAll({
      limit: Number(limit) ? Number(limit) : 100,
      offset: Number(offset) ? Number(offset) : 0,
    });
    return { data: tokens.rows, total: tokens.count, count: tokens.count };
  }

  async findOne(id: string): Promise<{ tokenId: string; userId: string; token: string }> {
    const token = await this.tokenModel.findOne({
      where: {
        tokenId: id,
      },
    });
  
    if (!token) {
      throw new NotFoundException('Token not found');
    }
  
    const data = {
      tokenId: token.tokenId,
      userId: token.userId,
      token: token.token,
    };
  
    return data;
  }

  async create(tokenData: any): Promise<Token> {
    const user = await this.tokenModel.create(tokenData);
    return user;
  }

  async update(id: string, tokenData: any): Promise<{ tokenId: string; userId: string; token: string; }> {
    const token = await this.tokenModel.findOne({
      where: { tokenId: id },
    });
    if (!token) {
      throw new NotFoundException('Token not found');
    }

    await token.update(tokenData);

    return {
      tokenId: token.tokenId,
      userId: token.userId,
      token: token.token,
    };
  }

  async remove(id: string): Promise<void> {
    await this.tokenModel.destroy({ where: { tokenId: id } });
  }
}
