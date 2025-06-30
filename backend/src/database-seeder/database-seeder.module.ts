import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseSeederService } from './database-seeder.service';
import { DatabaseSeederController } from './database-seeder.controller';
import { OrganizationTypesModule } from '../organization-types/organization-types.module';
import { LicenseTypesModule } from '../license-types/license-types.module';
import { ProfessionsModule } from '../professions/professions.module';
import { DepartmentsModule } from '../departments/departments.module';
import { StandTypesModule } from '../stand-types/stand-types.module';
import { ShipmentPackageStatesModule } from '../shipment-package-states/shipment-package-states.module';
import { PcbOrderStatesModule } from '../pcb-order-states/pcb-order-states.module';
import { OrganizationsModule } from '../organizations/organizations.module';
import { PeoplesModule } from '../peoples/peoples.module';
import { EmployeesModule } from '../employees/employees.module';
import { EmployeeDepartmentsModule } from '../employee-departments/employee-departments.module';
import { LicenseModule } from '../license/license.module';
import { StandsModule } from '../stands/stands.module';
import { StandPackagesModule } from '../stand-packages/stand-packages.module';
import { ComponentsModule } from '../components/components.module';
import { PcbsModule } from '../pcbs/pcbs.module';
import { PcbOrdersModule } from '../pcb-orders/pcb-orders.module';
import { OrderRequestsModule } from '../order-requests/order-requests.module';
import { OrderRequestsComponentsModule } from '../order-requests-components/order-requests-components.module';
import { OrderRequestComponentsModule } from 'src/order-request-components/order-request-components.module';
import { ShipmentsModule } from '../shipments/shipments.module';
import { ShipmentTripsModule } from '../shipment-trips/shipment-trips.module';
import { ShipmentPackageModule } from '../shipment-package/shipment-package.module';
import { OrganizationTypes } from '../organization-types/organization-types.entity';
import { LicenseTypes } from '../license-types/license-types.entity';
import { Professions } from '../professions/professions.entity';
import { Departments } from '../departments/departments.entity';
import { StandsTypes } from '../stand-types/stand-types.entity';
import { ShipmentPackageStates } from '../shipment-package-states/shipment-package-states.entity';
import { PcbOrderStates } from '../pcb-order-states/pcb-order-states.entity';
import { Peoples } from '../peoples/peoples.entity';
import { Organizations } from '../organizations/organizations.entity';
import { Employees } from '../employees/employees.entity';
import { EmployeeDepartments } from '../employee-departments/employee-departments.entity';
import { License } from '../license/license.entity';
import { Stands } from '../stands/stands.entity';
import { StandPackages } from '../stand-packages/stand-packages.entity';
import { Components } from '../components/components.entity';
import { PCBS } from '../pcbs/pcbs.entity';
import { OrderRequests } from '../order-requests/order-requests.entity';
import { OrderRequestsComponents } from '../order-requests-components/order-requests-components.entity';
import { PcbOrders } from '../pcb-orders/pcb-orders.entity';
import { Shipments } from '../shipments/shipments.entity';
import { ShipmentTrips } from '../shipment-trips/shipment-trips.entity';
import { ShipmentPackage } from '../shipment-package/shipment-package.entity';
import { CurrentTasks } from '../current-tasks/current-tasks.entity';
import { SupplierComponents } from '../supplier-components/supplier-components.entity';
import { PcbsComponents } from '../pcbs-components/pcbs-components.entity';
import { CurrentTasksComponents } from '../current-tasks-components/current-tasks-components.entity';
import { StandTasksComponents } from '../stand-tasks-components/stand-tasks-components.entity';
import { StandTasks } from '../stand-tasks/stand-tasks.entity';
import { CurrentTaskStates } from '../current-task-states/current-task-states.entity';
import { ArrivalInvoices } from '../arrival-invoices/arrival-invoices.entity';
import { BillsComponents } from '../bills-components/bills-components.entity';
import { BillsForPay } from '../bills-for-pay/bills-for-pay.entity';
import { ComponentPlacementType } from '../component_placement_type/component_placement_type.entity';
import { ComponentPlacements } from '../component_placements/component_placements.entity';
import { Inventarization } from '../inventarization/inventarization.entity';
import { EmployeesVacations } from '../employees-vacations/employees-vacations.entity';
import { EmployeesProfessions } from '../employees-professions/employees-professions.entity';
import { InvoicesComponents } from '../invoices-components/invoices-components.entity';
import { OrderRequestComponents } from '../order-request-components/order-request-components.entity';
import { ServerArrivals } from '../server-arrivals/server-arrivals.entity';
import { ServerWriteoff } from '../server-writeoff/server-writeoff.entity';
import { ShipmentsStands } from '../shipments-stands/shipments-stands.entity';
import { User } from '../user/user.entity';
import { Writeoff } from '../writeoff/writeoff.entity';
import { WriteoffReasons } from '../writeoff-reasons/writeoff-reasons.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrganizationTypes,
      LicenseTypes,
      Professions,
      Departments,
      StandsTypes,
      ShipmentPackageStates,
      PcbOrderStates,
      Peoples,
      Organizations,
      Employees,
      EmployeeDepartments,
      License,
      Stands,
      StandPackages,
      Components,
      PCBS,
      OrderRequests,
      OrderRequestsComponents,
      PcbOrders,
      Shipments,
      ShipmentTrips,
      ShipmentPackage,
      CurrentTasks,
      SupplierComponents,
      PcbsComponents,
      CurrentTasksComponents,
      StandTasksComponents,
      StandTasks,
      CurrentTaskStates,
      ArrivalInvoices,
      BillsComponents,
      BillsForPay,
      ComponentPlacementType,
      ComponentPlacements,
      Inventarization,
      EmployeesVacations,
      EmployeesProfessions,
      InvoicesComponents,
      OrderRequestComponents,
      ServerArrivals,
      ServerWriteoff,
      ShipmentsStands,
      User,
      Writeoff,
      WriteoffReasons,
    ]),
    OrganizationTypesModule,
    LicenseTypesModule,
    ProfessionsModule,
    DepartmentsModule,
    StandTypesModule,
    ShipmentPackageStatesModule,
    PcbOrderStatesModule,
    OrganizationsModule,
    PeoplesModule,
    EmployeesModule,
    EmployeeDepartmentsModule,
    LicenseModule,
    StandsModule,
    StandPackagesModule,
    ComponentsModule,
    PcbsModule,
    PcbOrdersModule,
    OrderRequestsModule,
    OrderRequestComponentsModule,
    OrderRequestsComponentsModule,
    ShipmentsModule,
    ShipmentTripsModule,
    ShipmentPackageModule,
  ],
  controllers: [DatabaseSeederController],
  providers: [DatabaseSeederService],
  exports: [DatabaseSeederService],
})
export class DatabaseSeederModule {}
