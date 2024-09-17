import {
  Injectable,
  Query,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import * as bcrypt from 'bcrypt';
import { ApiQuery } from '@nestjs/swagger';
import { Get } from '@nestjs/common';
import { QueryTypes, where } from 'sequelize';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../Email/email.service';
import { Character } from 'src/character/character.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Character) private characterModel: typeof Character,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async create(userData: any): Promise<Object> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(userData.password, salt);
    userData.password = hash;
    let findUser = await this.userModel.findOne({
      where: { email: userData.email },
    });
    if (findUser) {
      throw new UnauthorizedException('This email already exists in the db');
    }
    let user = await this.userModel.create(userData);
    const data = { sub: user.userId, email: user.email };
    const access_token = await this.jwtService.signAsync(data);
    const res = {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      access_token: access_token,
    };
    return res;
  }

  async withoutHashescreate(userData: any): Promise<Object> {
    let findUser = await this.userModel.findOne({
      where: { email: userData.email },
    });
    if (findUser) {
      throw new UnauthorizedException('This email already exists in the db');
    }
    let user = await this.userModel.create(userData);
    const data = { sub: user.userId, email: user.email };
    const access_token = await this.jwtService.signAsync(data);
    const res = {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      access_token: access_token,
    };
    return res;
  }

  async update(id: string, userData: any): Promise<User> {
    const users = await this.userModel.findOne({ where: { userId: id } });
    return await users.update(userData);
  }

  async findAll(payload) {
    const { page, limit, offset } = payload;
    const users = await this.userModel.findAll({
      limit: Number(limit) ? Number(limit) : 100,
      offset: Number(offset) ? Number(offset) : 0,
    });
    for (let i = 0; i < users.length; i++) {
      const characterIds = await this.characterModel.findAll({
        where: { userId: users[i].userId },
        attributes: ['characterId'],
        raw: true,
      });
      if (!users[i].character) {
        users[i].character = [];
      }
      users[i].character.push(...characterIds);
    }
    const modifiedUsers = users.map((user) => ({
      ...user.get(),
      character: user.character.map((character) => character.characterId),
    }));
    return { data: modifiedUsers, total: users.length, count: users.length };
  }

  async findOne(id: string): Promise<User> {
    const users = await this.userModel.findOne({
      where: {
        userId: id,
      },
    });
    const characterIds = await this.characterModel.findAll({
      where: { userId: users.userId },
      attributes: ['characterId'],
      raw: true,
    });
    if (!users.character) {
      users.character = [];
    }
    users.character.push(...characterIds);
    const modifiedUser = {
      ...users.get(),
      character: characterIds.map((character) => character.characterId),
    };
    return modifiedUser;
  }

  async delete(id: string): Promise<void> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await user.destroy();
  }

  async findAllByCharacter(characterId) {
    return this.userModel.sequelize.query(
      `select u.userId, u.firstName, u.lastName from Users u left join Characters c on u.userId = c.userId where c.characterId = '${characterId}'`,
      { type: QueryTypes.SELECT },
    );
  }

  async login(payload) {
    const user = await this.userModel.findOne({
      where: { email: payload.email },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isValid = await bcrypt.compare(payload.password, user.password);
    if (!isValid)
      throw new UnauthorizedException('You have entered incorrect password');
    const data = {
      userId: user.userId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    return { ...data, access_token: await this.jwtService.signAsync(payload) };
  }

  async forgotPassword(payload) {
    const user = await this.userModel.findOne({
      where: { email: payload.email },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const expiresIn = '1h';
    let resetToken = await this.jwtService.signAsync(payload, { expiresIn });
    const resetLink = `http://3.104.104.248:5001/Users/verifyToken/resetPassword?token=${resetToken}`;
    await this.emailService.sendPasswordResetEmail(user.email, resetLink);
    return {
      message: 'password reset link has been sent successfully to your email',
      token: resetToken,
    };
  }

  async resetPassword(payload) {
    const verify = await this.jwtService.verifyAsync(payload.token);
    const user = await this.userModel.findOne({
      where: { email: verify.email },
    });
    const salt = await bcrypt.genSalt(10);
    console.log(payload.password);
    const hash = await bcrypt.hash(payload.password, salt);
    user.update({ password: hash });
    return { message: 'Password reset successfully' };
  }

  async findAllByCluster(clusterId: string) {
    return this.userModel.sequelize.query(
      `
            select u.firstName, u.lastName from Users u LEFT JOIN Clusters cl on u.userId = cl.userId
            where cl.clusterId = '${clusterId}'`,
      { type: QueryTypes.SELECT },
    );
  }

  async getAllCharacter(id: string, payload) {
    const { page, limit, offset } = payload;
    const user = await this.userModel.findOne({
      where: {
        userId: id,
      },
    });
    if (user) {
      const characterData = await this.characterModel.findAll({
        limit: Number(limit) ? Number(limit) : 100,
        offset: Number(offset) ? Number(offset) : 0,
        where: { userId: user.userId },
        raw: true,
      });
      return { data: characterData, total: characterData.length };
    } else {
      throw new NotFoundException('User not found');
    }
  }
}
