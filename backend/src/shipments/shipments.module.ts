import { forwardRef, Module } from '@nestjs/common';
import { ShipmentsController } from './shipments.controller';
import { ShipmentsService } from './shipments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shipments } from './shipments.entity';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { LicenseModule } from 'src/license/license.module';
import { Stands } from 'src/stands/stands.entity';
import { ShipmentPackage } from 'src/shipment_package/shipment_package.entity';
import { ShipmentsStands } from 'src/shipments_stands/shipments_stands.entity';
import { CurrentTasksBusinessModule } from 'src/features/current-tasks-business/current-tasks-business.module';
import { User } from 'src/user/user.entity';
import { WebsocketModule } from 'src/websocket/websocket.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { NotifyUsersModule } from 'src/features/notify-users/notify-users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Shipments,
      Stands,
      ShipmentPackage,
      ShipmentsStands,
      User,
    ]),
    OrganizationsModule,
    LicenseModule,
    WebsocketModule,
    NotificationsModule,
    NotifyUsersModule,
    forwardRef(() => CurrentTasksBusinessModule),
  ],
  controllers: [ShipmentsController],
  providers: [ShipmentsService],
  exports: [ShipmentsService],
})
export class ShipmentsModule {}
