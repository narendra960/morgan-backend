import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Type } from './type/type.model';
import { Zone } from './zone/zone.model';

import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { Entry } from './entry/entry.model';
import { Attribute } from './attribute/attribute.model';
import { Region } from './region/region.model';
import { SearchController } from './search/search.controller';
import { TypeController } from './type/type.controller';
import { ZoneController } from './zone/zone.controller';
import { RegionController } from './region/region.controller';
import { EntryController } from './entry/entry.controller';
import { AttributeController } from './attribute/attribute.controller';
import { TypeService } from './type/type.service';
import { ZoneService } from './zone/zone.service';
import { RegionService } from './region/region.service';
import { EntryService } from './entry/entry.service';
import { AttributeService } from './attribute/attribute.service';
import { TypeModule } from './type/type.module';
import { ZoneModule } from './zone/zone.module';
import { RegionModule } from './region/region.module';
import { EntryModule } from './entry/entry.module';
import { AttributeModule } from './attribute/attribute.module';
import { SearchModule } from './search/serach.module';
import { SearchService } from './search/seach.service';
import { Tag } from './tag/tag.model';
import { TagModule } from './tag/tag.module';
import { TagController } from './tag/tag.controller';
import { TagService } from './tag/tag.service';
import { EntryAttribute } from './entryAttribute/entryAttribute.model';
import { EntryTag } from './entryTag/entryTag.model';
import { EntryAttributeModule } from './entryAttribute/entryAttribute.module';
import { EntryAttributeService } from './entryAttribute/entryAttribute.service';
import { EntryTagService } from './entryTag/entryTag.service';
import { ZoneTagService } from './zoneTag/zoneTag.service';
import { ZoneTagModule } from './zoneTag/zoneTag.module';
import { ZoneTag } from './zoneTag/zoneTag.model';
import { EntryTagModule } from './entryTag/entryTag.module';
import { RegionTag } from './regionTag/regionTag.model';
import { RegionTagModule } from './regionTag/regionTag.module';
import { RegionTagService } from './regionTag/regionTag.service';
import { Image } from './image/image.model';
import { ImageModule } from './image/image.module';
import { ImageContoller } from './image/image.controller';
import { ImageService } from './image/image.service';
import { EntryAttributeController } from './entryAttribute/entryAttribute.controller';
import { RegionAttribute } from './regionAttribute/regionAttribute.model';
import { RegionAttributeModule } from './regionAttribute/regionAttribute.module';
import { RegionAttributeController } from './regionAttribute/regionAttribute.controller';
import { RegionAttributeService } from './regionAttribute/regionAttribute.service';
import { ZoneAttribute } from './zoneAttribute/zoneAttribute.model';
import { ZoneAttributeModule } from './zoneAttribute/zoneAttribute.module';
import { ZoneAttributeController } from './zoneAttribute/zoneAttribute.controller';
import { ZoneAttributeService } from './zoneAttribute/zoneAttribute.service';
import { UploadController } from './upload/upload.controller';
import { UploadModule } from './upload/upload.module';
import { UploadService } from './upload/upload.service';
import { Groups } from './groups/groups.model';
import { GroupsModule } from './groups/groups.module';
import { GroupsController } from './groups/groups.controller';
import { GroupsService } from './groups/groups.service';
import { GroupTags } from './groupTags/groupTags.model';
import { GroupTagsModule } from './groupTags/groupTags.module';
import { GroupTagsController } from './groupTags/groupTags.controller';
import { GroupTagsService } from './groupTags/groupTags.service';
import { GroupAttribute } from './groupAttribute/groupAttribute.model';
import { GroupAttributeModule } from './groupAttribute/groupAttribute.module';
import { GroupAttributeController } from './groupAttribute/groupAttribute.controller';
import { GroupAttributeService } from './groupAttribute/groupAttribute.service';
import { GroupUnrealAsset } from './groupUnrealAssets/groupUnrealAsset.model';
import { GroupUnrealAssetController } from './groupUnrealAssets/groupUnrealAssets.controller';
import { GroupUnrealAssetModule } from './groupUnrealAssets/groupUnrealAsset.module';
import { GroupUnrealAssetService } from './groupUnrealAssets/groupUnrealAsset.service';
import { GroupMessage } from './groupMessage/groupMessage.model';
import { GroupMessageModule } from './groupMessage/groupMessage.module';
import { GroupMessageController } from './groupMessage/groupMessage.controller';
import { GroupMessageService } from './groupMessage/groupMessage.service';
import { GroupAffiliation } from './groupAffiliation/groupAffiliation.model';
import { GroupAffiliationController } from './groupAffiliation/groupAffiliation.controller';
import { GroupAffiliationService } from './groupAffiliation/groupAffiliation.service';
import { GroupAffiliationModule } from './groupAffiliation/groupAffiliation.module';
import { TemporaryGroup } from './temporaryGroup/temporaryGroup.model';
import { TemporaryGroupModule } from './temporaryGroup/temporaryGroup.module';
import { TemporaryGroupController } from './temporaryGroup/temporatyGroup.controller';
import { TemporaryGroupService } from './temporaryGroup/temporaryGroup.service';
import { Map } from './map/map.model';
import { MapModule } from './map/map.module';
import { MapController } from './map/map.controller';
import { MapService } from './map/map.service';
import { Dungeons } from './dungeons/dungeons.model';
import { DungeonsModule } from './dungeons/dungeons.module';
import { DungeonsController } from './dungeons/dungeons.controller';
import { DungeonsService } from './dungeons/dungeons.service';
import { DungeonTags } from './dungeonTags/dungeonTags.model';
import { DungeonAttribute } from './dungeonAttribute/dungeonAttribute.model';
import { DungeonAttributeModule } from './dungeonAttribute/dungeonAttribute.module';
import { DungeonTagsModule } from './dungeonTags/dungeonTags.module';
import { DungeonTagsController } from './dungeonTags/dungeonTags.controller';
import { DungeonAttributeController } from './dungeonAttribute/dungeonAttribute.controller';
import { DungeonTagsService } from './dungeonTags/dungeonTags.service';
import { DungeonAttributeService } from './dungeonAttribute/dungeonAttribute.service';
import { MailMessages } from './mailMessages/mailMessages.model';
import { MailMessageModule } from './mailMessages/mailMessages.module';
import { MailMessageController } from './mailMessages/mailMessages.controller';
import { MailMessageService } from './mailMessages/mailMessages.service';
import { User } from './user/user.model';
import { UserModule } from './user/user.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { Channel } from './channel/channel.model';
import { channelModule } from './channel/channel.module';
import { ChannelController } from './channel/channel.controller';
import { channelService } from './channel/channel.service';
import { Character } from './character/character.model';
import { CharacterModule } from './character/character.module';
import { CharacterController } from './character/character.controller';
import { CharacterService } from './character/character.service';
import { Cluster } from './cluster/cluster.model';
import { ClusterModule } from './cluster/cluster.module';
import { ClusterController } from './cluster/cluster.controller';
import { ClusterService } from './cluster/cluster.service';
import { ClusterPermission } from './clusterPermission/clusterPermission.model';
import { ClusterPermissionModule } from './clusterPermission/clusterPermission.module';
import { ClusterPermissionController } from './clusterPermission/clusterPermission.controller';
import { ClusterPermissionService } from './clusterPermission/clusterPermission.service';
import { Token } from './token/token.model';
import { TokenModule } from './token/token.module';
import { TokenController } from './token/token.controller';
import { TokenService } from './token/token.service';
import { MapTag } from './mapTag/mapTag.model';
import { MapTagModule } from './mapTag/mapTag.module';
import { MapTagService } from './mapTag/mapTag.service';
import { MapTagController } from './mapTag/mapTag.controller';
import { ClusterTag } from './clusterTag/clusterTag.model';
import { ClusterTagModule } from './clusterTag/clusterTag.module';
import { ClusterTagService } from './clusterTag/clusterTag.service';
import { ClusterTagController } from './clusterTag/clusterTag.controller';
import { AccountFriend } from './accountFriend/accountFriend.model';
import { AccountFriendModule } from './accountFriend/accountFriend.module';
import { AccountFriendService } from './accountFriend/accountFriend.service';
import { AccountFriendController } from './accountFriend/accountFriend.controller';

import { EmailController } from './Email/email.controller';
import { EmailModule } from './Email/email.module';
import { EmailService } from './Email/email.service';
import { UserMaps } from './userMaps/userMaps.model';
import { userMapsModule } from './userMaps/userMaps.module';
import { UserMapsController } from './userMaps/userMaps.controller';
import { userMapsService } from './userMaps/userMaps.service';
import { AwsBackupService } from './backup/backup.service';
import { AwsBackupController } from './backup/backup.controller';
import { AwsBackupModule } from './backup/backup.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      // host: '127.0.0.1',
      // username: 'root',/
      // password: '',
      // database: 'gameapi',
      logging: console.log,
      host: process.env.DATABASE_HOST,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      port: 3306,
      models: [
        Type,
        Zone,
        Entry,
        Attribute,
        Region,
        Tag,
        EntryAttribute,
        EntryTag,
        ZoneTag,
        RegionTag,
        Image,
        RegionAttribute,
        ZoneAttribute,
        Groups,
        GroupTags,
        GroupAttribute,
        GroupUnrealAsset,
        GroupMessage,
        GroupAffiliation,
        TemporaryGroup,
        Map,
        Dungeons,
        DungeonTags,
        DungeonAttribute,
        MailMessages,
        User,
        Channel,
        Character,
        Cluster,
        ClusterPermission,
        Token,
        MapTag,
        ClusterTag,
        AccountFriend,
        UserMaps,
      ],
      autoLoadModels: true,
      synchronize: true,
    }),
    ConfigModule.forRoot(),
    TypeModule,
    ZoneModule,
    RegionModule,
    EntryModule,
    AttributeModule,
    SearchModule,
    TagModule,
    EntryAttributeModule,
    ZoneTagModule,
    EntryTagModule,
    RegionTagModule,
    ImageModule,
    RegionAttributeModule,
    ZoneAttributeModule,
    UploadModule,
    GroupsModule,
    GroupTagsModule,
    GroupAttributeModule,
    GroupUnrealAssetModule,
    GroupMessageModule,
    GroupAttributeModule,
    GroupAffiliationModule,
    TemporaryGroupModule,
    MapModule,
    DungeonsModule,
    DungeonTagsModule,
    DungeonAttributeModule,
    MailMessageModule,
    UserModule,
    channelModule,
    ClusterModule,
    TokenModule,
    JwtModule.register({
      global: true,
      secret: process.env.jwtSecret,
      signOptions: { expiresIn: '60s' },
    }),
    CharacterModule,
    ClusterPermissionModule,
    MapTagModule,
    ClusterTagModule,
    AccountFriendModule,
    EmailModule,
    userMapsModule,
    AwsBackupModule,
  ],
  controllers: [
    AppController,
    SearchController,
    TypeController,
    ZoneController,
    EntryController,
    AttributeController,
    RegionController,
    TagController,
    ImageContoller,
    EntryAttributeController,
    RegionAttributeController,
    ZoneAttributeController,
    UploadController,
    GroupsController,
    GroupUnrealAssetController,
    GroupTagsController,
    GroupAttributeController,
    GroupMessageController,
    GroupAffiliationController,
    TemporaryGroupController,
    MapController,
    DungeonsController,
    DungeonTagsController,
    DungeonAttributeController,
    MailMessageController,
    UserController,
    ChannelController,
    CharacterController,
    ClusterController,
    ClusterPermissionController,
    TokenController,
    MapTagController,
    ClusterTagController,
    AccountFriendController,
    EmailController,
    UserMapsController,
    AwsBackupController,
  ],
  providers: [
    AppService,
    TypeService,
    ZoneService,
    EntryService,
    AttributeService,
    RegionService,
    SearchService,
    TagService,
    EntryAttributeService,
    EntryTagService,
    ZoneTagService,
    RegionTagService,
    ImageService,
    RegionService,
    RegionAttributeService,
    ZoneAttributeService,
    ImageService,
    UploadService,
    GroupsService,
    GroupTagsService,
    GroupAttributeService,
    GroupUnrealAssetService,
    GroupMessageService,
    GroupAffiliationService,
    TemporaryGroupService,
    MapService,
    DungeonsService,
    DungeonTagsService,
    DungeonAttributeService,
    MailMessageService,
    UserService,
    channelService,
    CharacterService,
    ClusterService,
    ClusterPermissionService,
    TokenService,
    MapTagService,
    ClusterTagService,
    AccountFriendService,
    EmailService,
    userMapsService,
    AwsBackupService,
  ],
})
export class AppModule {}
