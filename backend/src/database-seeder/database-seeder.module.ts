import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseSeederService } from './database-seeder.service';
import { DatabaseSeederController } from './database-seeder.controller';
import { CountriesModule } from '../countries/countries.module';
import { RegionModule } from '../region/region.module';
import { LocationsModule } from '../locations/locations.module';
import { OrganizationTypesModule } from '../organization-types/organization-types.module';
import { LicenseTypesModule } from '../license-types/license-types.module';
import { ProfessionsModule } from '../professions/professions.module';
import { DepartmentsModule } from '../departments/departments.module';
import { StandTypesModule } from '../stand-types/stand-types.module';
import { StandCategoriesModule } from '../stand-categories/stand-categories.module';
import { ShipmentStatesModule } from '../shipment-states/shipment-states.module';
import { ShipmentPackageStatesModule } from '../shipment-package-states/shipment-package-states.module';
import { OrderTypesModule } from '../order-types/order-types.module';
import { PcbOrderStatesModule } from '../pcb-order-states/pcb-order-states.module';
import { OrganizationsModule } from '../organizations/organizations.module';
import { PeoplesModule } from '../peoples/peoples.module';
import { EmployeesModule } from '../employees/employees.module';
import { EmployeeDepartmentsModule } from '../employee-departments/employee-departments.module';
import { LicenseModule } from '../license/license.module';
import { StandsModule } from '../stands/stands.module';
import { StandCoursesModule } from '../stand-courses/stand-courses.module';
import { StandPackagesModule } from '../stand-packages/stand-packages.module';
import { StandAssembliesModule } from '../stand-assemblies/stand-assemblies.module';
import { ComponentsModule } from '../components/components.module';
import { WarehouseComponentsModule } from '../warehouse-components/warehouse-components.module';
import { PcbWarehouseComponentsModule } from '../pcb-warehouse-components/pcb-warehouse-components.module';
import { PcbsModule } from '../pcbs/pcbs.module';
import { PcbOrdersModule } from '../pcb-orders/pcb-orders.module';
import { OrderRequestsModule } from '../order-requests/order-requests.module';
import { OrderRequestComponentsModule } from '../order-request-components/order-request-components.module';
import { ShipmentsModule } from '../shipments/shipments.module';
import { ShipmentTripsModule } from '../shipment-trips/shipment-trips.module';
import { ShipmentPackageModule } from '../shipment-package/shipment-package.module';
import { Countries } from '../countries/countries.entity';
import { Region } from '../region/region.entity';
import { Locations } from '../locations/locations.entity';
import { OrganizationTypes } from '../organization-types/organization-types.entity';
import { LicenseTypes } from '../license-types/license-types.entity';
import { Professions } from '../professions/professions.entity';
import { Departments } from '../departments/departments.entity';
import { StandsTypes } from '../stand-types/stand-types.entity';
import { StandCategories } from '../stand-categories/stand-categories.entity';
import { ShipmentStates } from '../shipment-states/shipment-states.entity';
import { ShipmentPackageStates } from '../shipment-package-states/shipment-package-states.entity';
import { OrderTypes } from '../order-types/order-types.entity';
import { PcbOrderStates } from '../pcb-order-states/pcb-order-states.entity';
import { Peoples } from '../peoples/peoples.entity';
import { Organizations } from '../organizations/organizations.entity';
import { Employees } from '../employees/employees.entity';
import { EmployeeDepartments } from '../employee-departments/employee-departments.entity';
import { License } from '../license/license.entity';
import { Stands } from '../stands/stands.entity';
import { StandAssemblies } from '../stand-assemblies/stand-assemblies.entity';
import { StandPackages } from '../stand-packages/stand-packages.entity';
import { Components } from '../components/components.entity';
import { WarehouseComponents } from '../warehouse-components/warehouse-components.entity';
import { PCBS } from '../pcbs/pcbs.entity';
import { PcbWarehouseComponents } from '../pcb-warehouse-components/pcb-warehouse-components.entity';
import { OrderRequests } from '../order-requests/order-requests.entity';
import { OrderRequestComponents } from '../order-request-components/order-request-components.entity';
import { PcbOrders } from '../pcb-orders/pcb-orders.entity';
import { Shipments } from '../shipments/shipments.entity';
import { ShipmentTrips } from '../shipment-trips/shipment-trips.entity';
import { ShipmentPackage } from '../shipment-package/shipment-package.entity';
import { ComponentsArrivalInvoice } from '../components_arrival_invoice/components_arrival_invoice.entity';
import { ComponentsInvoice } from '../components_invoice/components_invoice.entity';
import { CurrentTasks } from '../current-tasks/current-tasks.entity';
import { InvoicesArrival } from '../Invoices_arrival/Invoices_arrival.entity';
import { PaymentInvoice } from '../Payment_invoice/Payment_invoice.entity';
import { SendingBoxes } from '../sending_boxes/sending_boxes.entity';
import { StandCourses } from '../stand-courses/stand-courses.entity';
import { SuppliersModule } from '../suppliers/suppliers.module';
import { Suppliers } from '../suppliers/suppliers.entity';
import { SupplierComponents } from '../supplier-components/supplier-components.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Countries,
      Region,
      Locations,
      OrganizationTypes,
      LicenseTypes,
      Professions,
      Departments,
      StandsTypes,
      StandCategories,
      ShipmentStates,
      ShipmentPackageStates,
      OrderTypes,
      PcbOrderStates,
      Peoples,
      Organizations,
      Employees,
      EmployeeDepartments,
      License,
      Stands,
      StandAssemblies,
      StandPackages,
      Components,
      WarehouseComponents,
      PCBS,
      PcbWarehouseComponents,
      OrderRequests,
      OrderRequestComponents,
      PcbOrders,
      Shipments,
      ShipmentTrips,
      ShipmentPackage,
      ComponentsArrivalInvoice,
      ComponentsInvoice,
      CurrentTasks,
      InvoicesArrival,
      PaymentInvoice,
      SendingBoxes,
      StandCourses,
      Suppliers,
      SupplierComponents,
    ]),
    CountriesModule,
    RegionModule,
    LocationsModule,
    OrganizationTypesModule,
    LicenseTypesModule,
    ProfessionsModule,
    DepartmentsModule,
    StandTypesModule,
    StandCategoriesModule,
    ShipmentStatesModule,
    ShipmentPackageStatesModule,
    OrderTypesModule,
    PcbOrderStatesModule,
    OrganizationsModule,
    PeoplesModule,
    EmployeesModule,
    EmployeeDepartmentsModule,
    LicenseModule,
    StandsModule,
    StandCoursesModule,
    StandPackagesModule,
    StandAssembliesModule,
    ComponentsModule,
    WarehouseComponentsModule,
    PcbWarehouseComponentsModule,
    PcbsModule,
    PcbOrdersModule,
    OrderRequestsModule,
    OrderRequestComponentsModule,
    ShipmentsModule,
    ShipmentTripsModule,
    ShipmentPackageModule,
    SuppliersModule,
  ],
  controllers: [DatabaseSeederController],
  providers: [DatabaseSeederService],
  exports: [DatabaseSeederService],
})
export class DatabaseSeederModule {}
