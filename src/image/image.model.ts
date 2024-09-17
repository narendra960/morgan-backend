import {
  Column,
  Table,
  Model,
  PrimaryKey,
  AllowNull,
  DataType,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { DataTypes } from 'sequelize';

@Table
export class Image extends Model {
  @PrimaryKey
  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  })
  imageId: string;

  @Column
  @ApiProperty()
  imageDescription: string;

  @Column({
    type: DataTypes.TEXT,
    get() {
      const value = this.getDataValue('imageUrl');
      return value ? JSON.parse(value) : [];
    },
    set(value: string[]) {
      this.setDataValue('imageUrl', JSON.stringify(value));
    },
  })
  @ApiProperty()
  imageUrl: string[];

  @ApiProperty()
  @Column
  imageCategory: string;

  @ApiProperty()
  @Column
  imageSubcategory: string;
}
