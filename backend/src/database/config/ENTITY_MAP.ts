import { ArrivalInvoices } from 'src/arrival_invoices/arrival_invoices.entity';
import { BillsComponents } from 'src/bills_components/bills_components.entity';
import { BillsForPay } from 'src/bills_for_pay/bills_for_pay.entity';
import { ComponentPlacementType } from 'src/component_placement_type/component_placement_type.entity';
import { ComponentPlacements } from 'src/component_placements/component_placements.entity';
import { Components } from 'src/components/components.entity';
import { CurrentTaskStates } from 'src/current_task_states/current_task_states.entity';
import { CurrentTasks } from 'src/current_tasks/current_tasks.entity';
import { CurrentTasksComponents } from 'src/current_tasks_components/current_tasks_components.entity';
import { Departments } from 'src/departments/departments.entity';
import { EmployeeDepartments } from 'src/employee_departments/employee_departments.entity';
import { Employees } from 'src/employees/employees.entity';
import { EmployeesProfessions } from 'src/employees_professions/employees_professions.entity';
import { EmployeesVacations } from 'src/employees_vacations/employees_vacations.entity';
import { Inventarization } from 'src/inventarization/inventarization.entity';
import { InvoicesComponents } from 'src/invoices_components/invoices_components.entity';
import { License } from 'src/license/license.entity';
import { LicenseTypes } from 'src/license_types/license_types.entity';
import { OrderRequests } from 'src/order_requests/order_requests.entity';
import { OrderRequestsComponents } from 'src/order_requests_components/order_requests_components.entity';
import { OrganizationTypes } from 'src/organization_types/organization_types.entity';
import { Organizations } from 'src/organizations/organizations.entity';
import { PcbOrderStates } from 'src/pcb_order_states/pcb_order_states.entity';
import { PcbOrders } from 'src/pcb_orders/pcb_orders.entity';
import { PCBS } from 'src/pcbs/pcbs.entity';
import { PcbsComponents } from 'src/pcbs_components/pcbs_components.entity';
import { Peoples } from 'src/peoples/peoples.entity';
import { Professions } from 'src/professions/professions.entity';
import { ServerArrivals } from 'src/server_arrivals/server_arrivals.entity';
import { ServerWriteoff } from 'src/server_writeoff/server_writeoff.entity';
import { ShipmentPackage } from 'src/shipment_package/shipment_package.entity';
import { ShipmentPackageStates } from 'src/shipment_package_states/shipment_package_states.entity';
import { ShipmentTrips } from 'src/shipment_trips/shipment_trips.entity';
import { Shipments } from 'src/shipments/shipments.entity';
import { ShipmentsStands } from 'src/shipments_stands/shipments_stands.entity';
import { StandPackages } from 'src/stand_packages/stand_packages.entity';
import { StandTasks } from 'src/stand_tasks/stand_tasks.entity';
import { StandTasksComponents } from 'src/stand_tasks_components/stand_tasks_components.entity';
import { StandsTypes } from 'src/stand_types/stand_types.entity';
import { Stands } from 'src/stands/stands.entity';
import { SupplierComponents } from 'src/supplier_components/supplier_components.entity';
import { User } from 'src/user/user.entity';
import { Writeoff } from 'src/writeoff/writeoff.entity';
import { WriteoffReasons } from 'src/writeoff_reasons/writeoff_reasons.entity';

export const ENTITY_MAP = {
  arrival_invoices: ArrivalInvoices,
  bills_for_pay: BillsForPay,
  components: Components,
  bills_components: BillsComponents,
  component_placement_type: ComponentPlacementType,
  component_placement: ComponentPlacements,
  current_task_states: CurrentTaskStates,
  current_tasks: CurrentTasks,
  current_tasks_components: CurrentTasksComponents,
  departments: Departments,
  employee_departments: EmployeeDepartments,
  employees: Employees,
  employees_professions: EmployeesProfessions,
  employees_vacations: EmployeesVacations,
  inventarization: Inventarization,
  invoices_components: InvoicesComponents,
  license: License,
  license_types: LicenseTypes,
  order_requests: OrderRequests,
  order_requests_components: OrderRequestsComponents,
  ogranization_types: OrganizationTypes,
  organizations: Organizations,
  pcb_order_states: PcbOrderStates,
  pcb_orders: PcbOrders,
  pcbs: PCBS,
  pcbs_components: PcbsComponents,
  peoples: Peoples,
  professions: Professions,
  server_arrivals: ServerArrivals,
  server_writeoff: ServerWriteoff,
  shipment_package: ShipmentPackage,
  shipment_package_states: ShipmentPackageStates,
  shipment_trips: ShipmentTrips,
  shipments: Shipments,
  shipments_stands: ShipmentsStands,
  stand_packages: StandPackages,
  stand_tasks: StandTasks,
  stand_tasks_components: StandTasksComponents,
  stand_types: StandsTypes,
  stands: Stands,
  supplier_components: SupplierComponents,
  user: User,
  writeoff: Writeoff,
  writeoff_reasons: WriteoffReasons,
};
