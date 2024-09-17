import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, QueryTypes } from 'sequelize';
import { Character } from './character.model';
import { User } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';
import { error } from 'console';

@Injectable()
export class CharacterService {
  constructor(
    @InjectModel(Character) private characterModel: typeof Character,
    @InjectModel(User) private readonly userModel: typeof User,
    @Inject(UserService) private readonly userService: UserService,
  ) {}

  async findAll(payload) {
    const { page, limit, offset } = payload;

    const character = await this.characterModel.findAndCountAll({
      limit: Number(limit) ? Number(limit) : 100,
      offset: Number(offset) ? Number(offset) : 0,
      include: [
        {
          model: this.userModel,
          attributes: ['userId'],
        },
      ],
    });
    const characterData = await this.makeEntry(character.rows);
    return {
      data: characterData.data,
      total: character.count,
      count: character.count,
    };
  }

  async findByUser(payload) {
    const { user, page, limit, offset } = payload;

    const character = await this.characterModel.findAndCountAll({
      limit: Number(limit) ? Number(limit) : 100,
      offset: Number(offset) ? Number(offset) : 0,
      where: {
        userId: user,
      },
      include: [
        {
          model: this.userModel,
          attributes: ['userId'],
        },
      ],
    });
    const characterData = await this.makeEntry(character.rows);
    return {
      data: characterData.data,
      total: character.count,
      count: character.count,
    };
  }

  async findText(payload) {
    const { nickName } = payload;

    const character = await this.characterModel.findAndCountAll({
      where: {
        nickName: nickName,
      },
      include: [
        {
          model: this.userModel,
          attributes: ['userId'],
        },
      ],
    });
    const characterData = await this.makeEntry(character.rows);
    return {
      data: characterData.data,
      total: character.count,
      count: character.count,
    };
  }

  async makeEntry(character: Character[]) {
    if (character.length > 0) {
      let result = [];
      for (let i = 0; i < character.length; i++) {
        await this.userService
          .findAllByCharacter(character[i].characterId)
          .then(async (user) => {
            let users = [];
            if (user.length > 0) {
              await user.forEach((ele) => {
                users.push(ele);
              });
            }

            result.push({
              characterId: character[i].characterId,
              // firstName: character[i].firstName,
              // lastName: character[i].lastName,
              nickName: character[i].nickName,
              // dob: character[i].dob,
              userId: character[i].userId,
              characterData: character[i].characterData,
              user: users[0],
              clusterID: character[i].clusterId,
              mapId: character[i].mapId,
              defaultMapId: character[i].defaultMapId,
              lastmapAcessed: character[i].lastmapAcessed,
              lastportalAcessed: character[i].lastportalAcessed,
              characterStatus: character[i].characterStatus,
            });
          });
      }
      return { data: result };
    } else {
      return { data: [] };
    }
  }

  async findOne(id: string): Promise<Character> {
    return await this.characterModel
      .findOne({
        where: { characterId: id },
      })
      .then(async (character) => {
        return this.userService
          .findAllByCharacter(character.characterId)
          .then(async (user) => {
            let users = [];
            if (user) {
              await user.forEach((ele) => {
                users.push(ele);
              });
            }
            return {
              characterId: character.characterId,
              // firstName: character.firstName,
              // lastName: character.lastName,
              nickName: character.nickName,
              // dob: character.dob,
              userId: character.userId,
              user: users[0],
              characterData: character.characterData,
              clusterID: character.clusterId,
              mapId: character.mapId,
              defaultMapId: character.defaultMapId,
              lastmapAcessed: character.lastmapAcessed,
              lastportalAcessed: character.lastportalAcessed,
              characterStatus: character.characterStatus,
            };
          })
          .catch((err) => {
            return err;
          });
      });
  }

  async create(characterData: any): Promise<Character> {
    const character = await this.characterModel.create(characterData);
    if (!character) {
      throw new NotFoundException(
        'Something went wrong while enetering creating the character',
      );
    }
    return character;
  }

  async remove(id: string): Promise<void> {
    await this.characterModel.destroy({ where: { characterId: id } });
  }

  async update(id: string, characterData: any): Promise<Character> {
    const character = await this.characterModel.findOne({
      where: { characterId: id },
    });
    return await character.update(characterData);
  }

  async findAllByCluster(clusterId: string) {
    return this.characterModel.sequelize.query(
      `
            select c.firstName, c.lastName, c.nickName, c.dob from Characters c LEFT JOIN Clusters cl on c.characterId = cl.characterId 
            where cl.clusterId = '${clusterId}'`,
      { type: QueryTypes.SELECT },
    );
  }
}
