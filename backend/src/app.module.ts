import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { OrganizationTypesModule } from './organization_types/organization_types.module';
import { DepartmentsModule } from './departments/departments.module';
import { LicenseModule } from './license/license.module';
import { LicenseTypesModule } from './license_types/license_types.module';
import { EmployeesModule } from './employees/employees.module';
import { StandsController } from './stands/stands.controller';
import { StandsModule } from './stands/stands.module';
import { StandTypesModule } from './stand_types/stand_types.module';
import { DatabaseModule } from './database/database.module';
import { ShipmentPackageStatesModule } from './shipment_package_states/shipment_package_states.module';
import { ShipmentPackageModule } from './shipment_package/shipment_package.module';
import { ShipmentsModule } from './shipments/shipments.module';
import { ShipmentTripsModule } from './shipment_trips/shipment_trips.module';
import { PeoplesModule } from './peoples/peoples.module';
import { EmployeeDepartmentsModule } from './employee_departments/employee_departments.module';
import { ProfessionsModule } from './professions/professions.module';
import { StandPackagesModule } from './stand_packages/stand_packages.module';
import { OrderRequestsModule } from './order_requests/order_requests.module';
import { OrderRequestsComponentsModule } from './order_requests_components/order_requests_components.module';
import { PcbOrderStatesModule } from './pcb_order_states/pcb_order_states.module';
import { PcbsModule } from './pcbs/pcbs.module';
import { PcbOrdersModule } from './pcb_orders/pcb_orders.module';
import { DatabaseLocalizationModule } from './database_localization/database_localization.module';
import { DatabaseSeederModule } from './database_seeder/database_seeder.module';
import { CurrentTaskStatesModule } from './current_task_states/current_task_states.module';
import { ShipmentsStandsModule } from './shipments_stands/shipments_stands.module';
import { StandTasksModule } from './stand_tasks/stand_tasks.module';
import { EmployeesProfessionsModule } from './employees_professions/employees_professions.module';
import { EmployeesVacationsModule } from './employees_vacations/employees_vacations.module';
import { WriteoffModule } from './writeoff/writeoff.module';
import { WriteoffReasonsModule } from './writeoff_reasons/writeoff_reasons.module';
import { ServerWriteoffModule } from './server_writeoff/server_writeoff.module';
import { ArrivalInvoicesModule } from './arrival_invoices/arrival_invoices.module';
import { InvoicesComponentsModule } from './invoices_components/invoices_components.module';
import { ServerArrivalsModule } from './server_arrivals/server_arrivals.module';
import { ComponentPlacementsModule } from './component_placements/component_placements.module';
import { CurrentTasksComponentsModule } from './current_tasks_components/current_tasks_components.module';
import { CurrentTasksModule } from './current_tasks/current_tasks.module';
import { ComponentPlacementTypeModule } from './component_placement_type/component_placement_type.module';
import { BillsForPayModule } from './bills_for_pay/bills_for_pay.module';
import { BillsComponentsModule } from './bills_components/bills_components.module';
import { InventarizationModule } from './inventarization/inventarization.module';
import { PcbsComponentsModule } from './pcbs_components/pcbs_components.module';
import { StandTasksComponentsModule } from './stand_tasks_components/stand_tasks_components.module';
import { DatabaseEagerCachingModule } from './database_eager_caching/database_eager_caching.module';
import { DatabaseExportImportModule } from './database_export_import/database_export_import.module';
import { WebsocketModule } from './websocket/websocket.module';
import { CurrentTaskStatesLogModule } from './current_task_states_log/current_task_states_log.module';
import { ComponentsCategoriesModule } from './components_categories/components_categories.module';
import { PcbsCategoriesModule } from './pcbs_categories/pcbs_categories.module';

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
      logging: false, // если true, то будет выводиться вся информация о SQL запросах к базе данных
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
    DatabaseEagerCachingModule,
    DatabaseModule,
    ShipmentPackageStatesModule,
    ShipmentPackageModule,
    ShipmentTripsModule,
    PeoplesModule,
    EmployeeDepartmentsModule,
    ProfessionsModule,
    StandPackagesModule,
    OrderRequestsModule,
    OrderRequestsComponentsModule,
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
    CurrentTasksModule,
    DatabaseExportImportModule,
    WebsocketModule,
    CurrentTaskStatesLogModule,
    ComponentsCategoriesModule,
    PcbsCategoriesModule,
  ],
  controllers: [AppController, StandsController],
  providers: [AppService],
})
export class AppModule {}
