import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { OrganizationTypesModule } from './organization-types/organization-types.module';
import { DepartmentsModule } from './departments/departments.module';
import { LicenseModule } from './license/license.module';
import { LicenseTypesModule } from './license-types/license-types.module';
import { EmployeesModule } from './employees/employees.module';
import { StandsController } from './stands/stands.controller';
import { StandsModule } from './stands/stands.module';
import { StandTypesModule } from './stand-types/stand-types.module';
import { DatabaseModule } from './database/database.module';
import { ShipmentPackageStatesModule } from './shipment-package-states/shipment-package-states.module';
import { ShipmentPackageModule } from './shipment-package/shipment-package.module';
import { ShipmentsModule } from './shipments/shipments.module';
import { ShipmentTripsModule } from './shipment-trips/shipment-trips.module';
import { PeoplesModule } from './peoples/peoples.module';
import { EmployeeDepartmentsModule } from './employee-departments/employee-departments.module';
import { ProfessionsModule } from './professions/professions.module';
import { StandPackagesModule } from './stand-packages/stand-packages.module';
import { OrderRequestsModule } from './order-requests/order-requests.module';
import { OrderRequestComponentsModule } from './order-requests-components/order-requests-components.module';
import { PcbOrderStatesModule } from './pcb-order-states/pcb-order-states.module';
import { PcbsModule } from './pcbs/pcbs.module';
import { PcbOrdersModule } from './pcb-orders/pcb-orders.module';
import { DatabaseLocalizationModule } from './database-localization/database-localization.module';
import { DatabaseSeederModule } from './database-seeder/database-seeder.module';
import { CurrentTaskStatesModule } from './current-task-states/current-task-states.module';
import { ShipmentsStandsModule } from './shipments-stands/shipments-stands.module';
import { StandTasksModule } from './stand-tasks/stand-tasks.module';
import { EmployeesProfessionsModule } from './employees-professions/employees-professions.module';
import { EmployeesVacationsModule } from './employees-vacations/employees-vacations.module';
import { WriteoffModule } from './writeoff/writeoff.module';
import { WriteoffReasonsModule } from './writeoff-reasons/writeoff-reasons.module';
import { ServerWriteoffModule } from './server-writeoff/server-writeoff.module';
import { ArrivalInvoicesModule } from './arrival-invoices/arrival-invoices.module';
import { InvoicesComponentsModule } from './invoices-components/invoices-components.module';
import { ServerArrivalsModule } from './server-arrivals/server-arrivals.module';
import { ComponentPlacementsModule } from './component_placements/component_placements.module';
import { CurrentTasksComponentsModule } from './current-tasks-components/current-tasks-components.module';
import { ComponentPlacementTypeModule } from './component_placement_type/component_placement_type.module';
import { BillsForPayModule } from './bills-for-pay/bills-for-pay.module';
import { BillsComponentsModule } from './bills-components/bills-components.module';
import { InventarizationModule } from './inventarization/inventarization.module';
import { PcbsComponentsModule } from './pcbs-components/pcbs-components.module';
import { StandTasksComponentsModule } from './stand-tasks-components/stand-tasks-components.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Yoga105!',
      database: 'crm_practice',
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
      entities: ['dist/**/*.entity{.ts,.js}'],
      extra: {
        charset: 'utf8mb4',
      },
      timezone: 'Z',
    }),
    UserModule,
    AuthModule,
    OrganizationsModule,
    OrganizationTypesModule,
    DepartmentsModule,
    LicenseModule,
    LicenseTypesModule,
    EmployeesModule,
    StandsModule,
    StandTypesModule,
    ShipmentsModule,
    DatabaseModule,
    ShipmentPackageStatesModule,
    ShipmentPackageModule,
    ShipmentTripsModule,
    PeoplesModule,
    EmployeeDepartmentsModule,
    ProfessionsModule,
    StandPackagesModule,
    OrderRequestsModule,
    OrderRequestComponentsModule,
    PcbOrderStatesModule,
    PcbsModule,
    PcbOrdersModule,
    DatabaseLocalizationModule,
    DatabaseSeederModule,
    CurrentTaskStatesModule,
    ShipmentsStandsModule,
    StandTasksModule,
    EmployeesProfessionsModule,
    EmployeesVacationsModule,
    WriteoffModule,
    WriteoffReasonsModule,
    ServerWriteoffModule,
    ArrivalInvoicesModule,
    InvoicesComponentsModule,
    ServerArrivalsModule,
    ComponentPlacementsModule,
    CurrentTasksComponentsModule,
    ComponentPlacementTypeModule,
    BillsForPayModule,
    BillsComponentsModule,
    InventarizationModule,
    PcbsComponentsModule,
    StandTasksComponentsModule,
    ArrivalInvoicesModule,
  ],
  controllers: [AppController, StandsController],
  providers: [AppService],
})
export class AppModule {}
