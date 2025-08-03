import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseSeederService } from './database_seeder.service';
import { DatabaseSeederController } from './database_seeder.controller';
import { OrganizationTypesModule } from '../organization_types/organization_types.module';
import { LicenseTypesModule } from '../license_types/license_types.module';
import { ProfessionsModule } from '../professions/professions.module';
import { DepartmentsModule } from '../departments/departments.module';
import { StandTypesModule } from '../stand_types/stand_types.module';
import { ShipmentPackageStatesModule } from '../shipment_package_states/shipment_package_states.module';
import { PcbOrderStatesModule } from '../pcb_order_states/pcb_order_states.module';
import { OrganizationsModule } from '../organizations/organizations.module';
import { PeoplesModule } from '../peoples/peoples.module';
import { EmployeesModule } from '../employees/employees.module';
import { EmployeeDepartmentsModule } from '../employee_departments/employee_departments.module';
import { LicenseModule } from '../license/license.module';
import { StandsModule } from '../stands/stands.module';
import { StandPackagesModule } from '../stand_packages/stand_packages.module';
import { ComponentsModule } from '../components/components.module';
import { PcbsModule } from '../pcbs/pcbs.module';
import { PcbOrdersModule } from '../pcb_orders/pcb_orders.module';
import { OrderRequestsModule } from '../order_requests/order_requests.module';
import { OrderRequestsComponentsModule } from '../order_requests_components/order_requests_components.module';
import { ShipmentsModule } from '../shipments/shipments.module';
import { ShipmentTripsModule } from '../shipment_trips/shipment_trips.module';
import { ShipmentPackageModule } from '../shipment_package/shipment_package.module';
import { OrganizationTypes } from '../organization_types/organization_types.entity';
import { LicenseTypes } from '../license_types/license_types.entity';
import { Professions } from '../professions/professions.entity';
import { Departments } from '../departments/departments.entity';
import { StandsTypes } from '../stand_types/stand_types.entity';
import { ShipmentPackageStates } from '../shipment_package_states/shipment_package_states.entity';
import { PcbOrderStates } from '../pcb_order_states/pcb_order_states.entity';
import { Peoples } from '../peoples/peoples.entity';
import { Organizations } from '../organizations/organizations.entity';
import { Employees } from '../employees/employees.entity';
import { EmployeeDepartments } from '../employee_departments/employee_departments.entity';
import { License } from '../license/license.entity';
import { Stands } from '../stands/stands.entity';
import { StandPackages } from '../stand_packages/stand_packages.entity';
import { Components } from '../components/components.entity';
import { PCBS } from '../pcbs/pcbs.entity';
import { OrderRequests } from '../order_requests/order_requests.entity';
import { OrderRequestsComponents } from '../order_requests_components/order_requests_components.entity';
import { PcbOrders } from '../pcb_orders/pcb_orders.entity';
import { Shipments } from '../shipments/shipments.entity';
import { ShipmentTrips } from '../shipment_trips/shipment_trips.entity';
import { ShipmentPackage } from '../shipment_package/shipment_package.entity';
import { CurrentTasks } from '../current_tasks/current_tasks.entity';
import { SupplierComponents } from '../supplier_components/supplier_components.entity';
import { PcbsComponents } from '../pcbs_components/pcbs_components.entity';
import { CurrentTasksComponents } from '../current_tasks_components/current_tasks_components.entity';
import { StandTasksComponents } from '../stand_tasks_components/stand_tasks_components.entity';
import { StandTasks } from '../stand_tasks/stand_tasks.entity';
import { CurrentTaskStates } from '../current_task_states/current_task_states.entity';
import { ArrivalInvoices } from '../arrival_invoices/arrival_invoices.entity';
import { BillsComponents } from '../bills_components/bills_components.entity';
import { BillsForPay } from '../bills_for_pay/bills_for_pay.entity';
import { ComponentPlacementType } from '../component_placement_type/component_placement_type.entity';
import { ComponentPlacements } from '../component_placements/component_placements.entity';
import { Inventarization } from '../inventarization/inventarization.entity';
import { EmployeesVacations } from '../employees_vacations/employees_vacations.entity';
import { EmployeesProfessions } from '../employees_professions/employees_professions.entity';
import { InvoicesComponents } from '../invoices_components/invoices_components.entity';
import { ServerArrivals } from '../server_arrivals/server_arrivals.entity';
import { ServerWriteoff } from '../server_writeoff/server_writeoff.entity';
import { ShipmentsStands } from '../shipments_stands/shipments_stands.entity';
import { User } from '../user/user.entity';
import { Writeoff } from '../writeoff/writeoff.entity';
import { WriteoffReasons } from '../writeoff_reasons/writeoff_reasons.entity';
import { Rights } from 'src/rights/rights.entity';
import { ProfessionRights } from 'src/profession_rights/profession_rights.entity';

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
      ServerArrivals,
      ServerWriteoff,
      ShipmentsStands,
      User,
      Writeoff,
      WriteoffReasons,
      Rights,
      ProfessionRights,
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
