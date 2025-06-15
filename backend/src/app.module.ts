import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CountriesModule } from './countries/countries.module';
import { RegionModule } from './region/region.module';
import { LocationsModule } from './locations/locations.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { OrganizationTypesModule } from './organization-types/organization-types.module';
import { DepartmentsModule } from './departments/departments.module';
import { StudentsModule } from './students/students.module';
import { LicenseModule } from './license/license.module';
import { LicenseTypesModule } from './license-types/license-types.module';
import { EmployeesModule } from './employees/employees.module';
import { StandsController } from './stands/stands.controller';
import { StandsModule } from './stands/stands.module';
import { StandCategoriesModule } from './stand-categories/stand-categories.module';
import { StandCoursesController } from './stand-courses/stand-courses.controller';
import { StandCoursesModule } from './stand-courses/stand-courses.module';
import { StandTypesModule } from './stand-types/stand-types.module';
import { DatabaseModule } from './database/database.module';
import { ShipmentPackageStatesModule } from './shipment-package-states/shipment-package-states.module';
import { ShipmentPackageModule } from './shipment-package/shipment-package.module';
import { ShipmentsModule } from './shipments/shipments.module';
import { ShipmentStatesModule } from './shipment-states/shipment-states.module';
import { ShipmentTripsModule } from './shipment-trips/shipment-trips.module';
import { PeoplesModule } from './peoples/peoples.module';
import { EmployeeStatesModule } from './employee-states/employee-states.module';
import { EmployeeDepartmentsModule } from './employee-departments/employee-departments.module';
import { ProfessionsModule } from './professions/professions.module';
import { StandAssembliesModule } from './stand-assemblies/stand-assemblies.module';
import { StandPackagesModule } from './stand-packages/stand-packages.module';
import { WarehouseComponentsModule } from './warehouse-components/warehouse-components.module';
import { OrderRequestsModule } from './order-requests/order-requests.module';
import { OrderRequestComponentsModule } from './order-request-components/order-request-components.module';
import { OrderTypesModule } from './order-types/order-types.module';
import { PcbOrderStatesModule } from './pcb-order-states/pcb-order-states.module';
import { PcbsModule } from './pcbs/pcbs.module';
import { PcbWarehouseComponentsModule } from './pcb-warehouse-components/pcb-warehouse-components.module';
import { PcbOrdersModule } from './pcb-orders/pcb-orders.module';
import { DatabaseLocalizationModule } from './database-localization/database-localization.module';
import { DatabaseSeederModule } from './database-seeder/database-seeder.module';

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
    }),
    UserModule,
    AuthModule,
    CountriesModule,
    RegionModule,
    LocationsModule,
    OrganizationsModule,
    OrganizationTypesModule,
    DepartmentsModule,
    StudentsModule,
    LicenseModule,
    LicenseTypesModule,
    EmployeesModule,
    StandsModule,
    StandCategoriesModule,
    StandCoursesModule,
    StandTypesModule,
    ShipmentsModule,
    DatabaseModule,
    ShipmentPackageStatesModule,
    ShipmentPackageModule,
    ShipmentStatesModule,
    ShipmentTripsModule,
    PeoplesModule,
    EmployeeStatesModule,
    EmployeeDepartmentsModule,
    ProfessionsModule,
    StandAssembliesModule,
    StandPackagesModule,
    WarehouseComponentsModule,
    OrderRequestsModule,
    OrderRequestComponentsModule,
    OrderTypesModule,
    PcbOrderStatesModule,
    PcbsModule,
    PcbWarehouseComponentsModule,
    PcbOrdersModule,
    DatabaseLocalizationModule,
    DatabaseSeederModule,
  ],
  controllers: [AppController, StandsController, StandCoursesController],
  providers: [AppService],
})
export class AppModule {}
