import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker/locale/ru';
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

@Injectable()
export class DatabaseSeederService {
  private readonly logger = new Logger(DatabaseSeederService.name);

  constructor(
    @InjectRepository(OrganizationTypes)
    private readonly organizationTypesRepository: Repository<OrganizationTypes>,
    @InjectRepository(LicenseTypes)
    private readonly licenseTypesRepository: Repository<LicenseTypes>,
    @InjectRepository(Professions)
    private readonly professionsRepository: Repository<Professions>,
    @InjectRepository(Departments)
    private readonly departmentsRepository: Repository<Departments>,
    @InjectRepository(StandsTypes)
    private readonly standTypesRepository: Repository<StandsTypes>,
    @InjectRepository(ShipmentPackageStates)
    private readonly shipmentPackageStatesRepository: Repository<ShipmentPackageStates>,
    @InjectRepository(PcbOrderStates)
    private readonly pcbOrderStatesRepository: Repository<PcbOrderStates>,
    @InjectRepository(Peoples)
    private readonly peoplesRepository: Repository<Peoples>,
    @InjectRepository(Organizations)
    private readonly organizationsRepository: Repository<Organizations>,
    @InjectRepository(Employees)
    private readonly employeesRepository: Repository<Employees>,
    @InjectRepository(EmployeeDepartments)
    private readonly employeeDepartmentsRepository: Repository<EmployeeDepartments>,
    @InjectRepository(License)
    private readonly licenseRepository: Repository<License>,
    @InjectRepository(Stands)
    private readonly standsRepository: Repository<Stands>,
    @InjectRepository(StandPackages)
    private readonly standPackagesRepository: Repository<StandPackages>,
    @InjectRepository(Components)
    private readonly componentsRepository: Repository<Components>,
    @InjectRepository(PCBS)
    private readonly pcbsRepository: Repository<PCBS>,
    @InjectRepository(OrderRequests)
    private readonly orderRequestsRepository: Repository<OrderRequests>,
    @InjectRepository(OrderRequestsComponents)
    private readonly orderRequestsComponentsRepository: Repository<OrderRequestsComponents>,
    @InjectRepository(PcbOrders)
    private readonly pcbOrdersRepository: Repository<PcbOrders>,
    @InjectRepository(Shipments)
    private readonly shipmentsRepository: Repository<Shipments>,
    @InjectRepository(ShipmentTrips)
    private readonly shipmentTripsRepository: Repository<ShipmentTrips>,
    @InjectRepository(ShipmentPackage)
    private readonly shipmentPackageRepository: Repository<ShipmentPackage>,
    @InjectRepository(CurrentTasks)
    private readonly currentTasksRepository: Repository<CurrentTasks>,
    @InjectRepository(SupplierComponents)
    private readonly supplierComponentsRepository: Repository<SupplierComponents>,
    @InjectRepository(PcbsComponents)
    private readonly pcbsComponentsRepository: Repository<PcbsComponents>,
    @InjectRepository(CurrentTasksComponents)
    private readonly currentTasksComponentsRepository: Repository<CurrentTasksComponents>,
    @InjectRepository(StandTasksComponents)
    private readonly standTasksComponentsRepository: Repository<StandTasksComponents>,
    @InjectRepository(StandTasks)
    private readonly standTasksRepository: Repository<StandTasks>,
    @InjectRepository(CurrentTaskStates)
    private readonly currentTaskStatesRepository: Repository<CurrentTaskStates>,
    @InjectRepository(ArrivalInvoices)
    private readonly arrivalInvoicesRepository: Repository<ArrivalInvoices>,
    @InjectRepository(BillsComponents)
    private readonly billsComponentsRepository: Repository<BillsComponents>,
    @InjectRepository(BillsForPay)
    private readonly billsForPayRepository: Repository<BillsForPay>,
    @InjectRepository(ComponentPlacementType)
    private readonly componentPlacementTypeRepository: Repository<ComponentPlacementType>,
    @InjectRepository(ComponentPlacements)
    private readonly componentPlacementsRepository: Repository<ComponentPlacements>,
    @InjectRepository(Inventarization)
    private readonly inventarizationRepository: Repository<Inventarization>,
    @InjectRepository(EmployeesVacations)
    private readonly employeesVacationsRepository: Repository<EmployeesVacations>,
    @InjectRepository(EmployeesProfessions)
    private readonly employeesProfessionsRepository: Repository<EmployeesProfessions>,
    @InjectRepository(InvoicesComponents)
    private readonly invoicesComponentsRepository: Repository<InvoicesComponents>,
    @InjectRepository(OrderRequestComponents)
    private readonly orderRequestComponentsRepository: Repository<OrderRequestComponents>,
    @InjectRepository(ServerArrivals)
    private readonly serverArrivalsRepository: Repository<ServerArrivals>,
    @InjectRepository(ServerWriteoff)
    private readonly serverWriteoffRepository: Repository<ServerWriteoff>,
    @InjectRepository(ShipmentsStands)
    private readonly shipmentsStandsRepository: Repository<ShipmentsStands>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Writeoff)
    private readonly writeoffRepository: Repository<Writeoff>,
    @InjectRepository(WriteoffReasons)
    private readonly writeoffReasonsRepository: Repository<WriteoffReasons>,
  ) {}

  async seed() {
    try {
      this.logger.log('Начало заполнения базы данных тестовыми данными...');

      // 1. Заполнение справочников
      await this.seedReferenceData();

      // 2. Заполнение основных сущностей
      const mainEntities = await this.seedMainEntities();

      // 3. Заполнение заказов и отправок
      await this.seedOrdersAndShipments();

      // 4. Заполнение дополнительных сущностей
      await this.seedAdditionalEntities(mainEntities);

      this.logger.log('База данных успешно заполнена тестовыми данными!');
    } catch (error) {
      this.logger.error('Ошибка при заполнении базы данных:', error);
      throw error;
    }
  }

  private async seedReferenceData() {
    this.logger.log('Заполнение справочников...');

    // Заполнение типов организаций
    const organizationTypes = await this.seedOrganizationTypes();
    this.logger.log(`Создано ${organizationTypes.length} типов организаций`);

    // Заполнение типов лицензий
    const licenseTypes = await this.seedLicenseTypes();
    this.logger.log(`Создано ${licenseTypes.length} типов лицензий`);

    // Заполнение отделов
    const departments = await this.seedDepartments();
    this.logger.log(`Создано ${departments.length} отделов`);

    // Заполнение типов стендов
    const standTypes = await this.seedStandTypes();
    this.logger.log(`Создано ${standTypes.length} типов стендов`);

    // Заполнение статусов пакетов отправок
    const shipmentPackageStates = await this.seedShipmentPackageStates();
    this.logger.log(
      `Создано ${shipmentPackageStates.length} статусов пакетов отправок`,
    );

    // Заполнение статусов заказов PCB
    const pcbOrderStates = await this.seedPcbOrderStates();
    this.logger.log(`Создано ${pcbOrderStates.length} статусов заказов PCB`);

    // Заполнение статусов текущих задач
    const currentTaskStates = await this.seedCurrentTaskStates();
    this.logger.log(`Создано ${currentTaskStates.length} статусов текущих задач`);

    // Заполнение компонентов
    const components = await this.seedComponents();
    this.logger.log(`Создано ${components.length} компонентов`);

    return {
      organizationTypes,
      licenseTypes,
      departments,
      standTypes,
      shipmentPackageStates,
      pcbOrderStates,
      currentTaskStates,
      components,
    };
  }

  private async seedOrganizationTypes(): Promise<OrganizationTypes[]> {
    const typesData = [
      { title: 'Производитель', icon: '🏭' },
      { title: 'Поставщик', icon: '📦' },
      { title: 'Перевозчик', icon: '🚚' },
      { title: 'Клиент', icon: '👤' },
      { title: 'Партнер', icon: '🤝' },
    ];

    const types = typesData.map((data) =>
      this.organizationTypesRepository.create(data),
    );
    return await this.organizationTypesRepository.save(types);
  }

  private async seedLicenseTypes(): Promise<LicenseTypes[]> {
    const typesData = [
      { title: 'Стандартная' },
      { title: 'Расширенная' },
      { title: 'Корпоративная' },
      { title: 'Пробная' },
    ];

    const types = typesData.map((data) =>
      this.licenseTypesRepository.create(data),
    );
    return await this.licenseTypesRepository.save(types);
  }

  private async seedDepartments(): Promise<Departments[]> {
    const departmentsData = [
      { title: 'Производство' },
      { title: 'Сборка' },
      { title: 'Логистика' },
      { title: 'Продажи' },
      { title: 'Закупки' },
      { title: 'IT' },
    ];

    const departments = departmentsData.map((data) =>
      this.departmentsRepository.create(data),
    );
    return await this.departmentsRepository.save(departments);
  }

  private async seedStandTypes(): Promise<StandsTypes[]> {
    const typesData = [
      { title: 'Учебный' },
      { title: 'Производственный' },
      { title: 'Тестовый' },
      { title: 'Демонстрационный' },
    ];

    const types = typesData.map((data) =>
      this.standTypesRepository.create(data),
    );
    return await this.standTypesRepository.save(types);
  }

  private async seedShipmentPackageStates(): Promise<ShipmentPackageStates[]> {
    const statesData = [
      { title: 'Упакован' },
      { title: 'В пути' },
      { title: 'Доставлен' },
      { title: 'Поврежден' },
      { title: 'Утерян' },
    ];

    const states = statesData.map((data) =>
      this.shipmentPackageStatesRepository.create(data),
    );
    return await this.shipmentPackageStatesRepository.save(states);
  }

  private async seedPcbOrderStates(): Promise<PcbOrderStates[]> {
    const statesData = [
      { state: 'Новый' },
      { state: 'В производстве' },
      { state: 'Готов' },
      { state: 'Отправлен' },
      { state: 'Отменен' },
    ];

    const states = statesData.map((data) =>
      this.pcbOrderStatesRepository.create(data),
    );
    return await this.pcbOrderStatesRepository.save(states);
  }

  private async seedCurrentTaskStates(): Promise<CurrentTaskStates[]> {
    const statesData = [
      { title: 'Новая' },
      { title: 'Выполняется' },
      { title: 'Завершена' },
      { title: 'Отменена' },
    ];

    const states = statesData.map((data) =>
      this.currentTaskStatesRepository.create(data),
    );
    return await this.currentTaskStatesRepository.save(states);
  }

  private async seedComponents(): Promise<Components[]> {
    const componentsData = Array.from({ length: 100 }, () => ({
      title: faker.commerce.productName().substring(0, 45),
      photo: faker.image.url().substring(0, 45),
      width: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
      height: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
      thickness: faker.number.float({ min: 1, max: 100, fractionDigits: 2 }),
      weight: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
      material: faker.commerce.productMaterial().substring(0, 45),
      receiptDate: faker.date.past(),
      drawingReference: faker.string.alphanumeric(10).toUpperCase(),
    }));

    const components = componentsData.map((data) => this.componentsRepository.create(data));
    return await this.componentsRepository.save(components);
  }

  private async seedMainEntities() {
    this.logger.log('Заполнение основных сущностей...');

    // Заполнение людей
    const peoples = await this.seedPeoples();
    this.logger.log(`Создано ${peoples.length} людей`);

    // Заполнение организаций
    const organizations = await this.seedOrganizations(peoples);
    this.logger.log(`Создано ${organizations.length} организаций`);

    // Заполнение сотрудников
    const employees = await this.seedEmployees(peoples);
    this.logger.log(`Создано ${employees.length} сотрудников`);

    // Заполнение связей сотрудников с отделами
    const employeeDepartments = await this.seedEmployeeDepartments(employees);
    this.logger.log(`Создано ${employeeDepartments.length} связей сотрудников с отделами`);

    // Заполнение лицензий
    const licenses = await this.seedLicenses(organizations);
    this.logger.log(`Создано ${licenses.length} лицензий`);

    // Заполнение стендов
    const stands = await this.seedStands(employees);
    this.logger.log(`Создано ${stands.length} стендов`);

    // Заполнение пакетов стендов
    const standPackages = await this.seedStandPackages(stands);
    this.logger.log(`Создано ${standPackages.length} упаковок стендов`);

    // Заполнение PCB
    const pcbs = await this.seedPCBS(stands);
    this.logger.log(`Создано ${pcbs.length} PCB`);

    return {
      peoples,
      organizations,
      employees,
      employeeDepartments,
      licenses,
      stands,
      standPackages,
      pcbs,
    };
  }

  private async seedPeoples(): Promise<Peoples[]> {
    const peoplesData = Array.from({ length: 100 }, () => {
      const birthDate = faker.date.past({ years: 50 });
      return {
        firstName: faker.person.firstName().substring(0, 45),
        lastName: faker.person.lastName().substring(0, 45),
        middleName: faker.person.middleName().substring(0, 45),
        birthDate: new Date(
          birthDate.getFullYear(),
          birthDate.getMonth(),
          birthDate.getDate(),
        ),
        phone: faker.string.numeric(11),
        email: faker.internet.email().substring(0, 100),
      };
    });

    const peoples = peoplesData.map((data) =>
      this.peoplesRepository.create(data),
    );
    return await this.peoplesRepository.save(peoples);
  }

  private async seedOrganizations(
    peoples: Peoples[],
  ): Promise<Organizations[]> {
    const organizationTypes = await this.organizationTypesRepository.find();

    const organizationsData = Array.from({ length: 50 }, () => {
      const ogrnDate = faker.date.past();
      return {
        parentId: faker.string.alphanumeric(10),
        fullName: faker.company.name().substring(0, 80),
        shortName: faker.company.name().substring(0, 80),
        lawAddress: faker.location.streetAddress().substring(0, 100),
        factAddress: faker.location.streetAddress().substring(0, 100),
        postAddress: faker.location.streetAddress().substring(0, 100),
        inn: faker.string.numeric(10),
        kpp: faker.string.numeric(9),
        orgn: faker.string.numeric(13),
        orgnDate: new Date(
          ogrnDate.getFullYear(),
          ogrnDate.getMonth(),
          ogrnDate.getDate(),
        ),
        phone: faker.string.numeric(11),
        email: faker.internet.email().substring(0, 80),
        digitalDocs: faker.datatype.boolean(),
        rating: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
        comment: faker.lorem.sentence().substring(0, 45),
        peoples: faker.helpers.arrayElement(peoples),
        organizationTypes: faker.helpers.arrayElement(organizationTypes),
      };
    });

    const organizations = organizationsData.map((data) =>
      this.organizationsRepository.create(data),
    );
    return await this.organizationsRepository.save(organizations);
  }

  private async seedEmployees(peoples: Peoples[]): Promise<Employees[]> {
    const employees = peoples.map((people) => {
      return this.employeesRepository.create({
        peoples: people,
      });
    });

    const createdEmployees = await this.employeesRepository.save(employees);
    console.log(
      `Created ${createdEmployees.length} employees with professions and states`,
    );
    return createdEmployees;
  }

  private async seedEmployeeDepartments(
    employees: Employees[],
  ): Promise<EmployeeDepartments[]> {
    const departments = await this.departmentsRepository.find();
    const employeeDepartmentsData = employees.flatMap((employee) =>
      faker.helpers
        .arrayElements(departments, { min: 1, max: 3 })
        .map((department) => ({
          employees: employee,
          departments: department,
        })),
    );

    const employeeDepartments = employeeDepartmentsData.map((data) =>
      this.employeeDepartmentsRepository.create(data),
    );
    return await this.employeeDepartmentsRepository.save(employeeDepartments);
  }

  private async seedLicenses(
    organizations: Organizations[],
  ): Promise<License[]> {
    const licenseTypes = await this.licenseTypesRepository.find();

    // Создаем больше лицензий, чем организаций, чтобы хватило для отправок
    const licensesData = Array.from(
      { length: organizations.length * 2 },
      () => {
        // Генерируем только даты без времени
        const startDate = faker.date.past();
        const endDate = faker.date.future();
        const timeoutDate = faker.date.future();

        return {
          licenseCode: faker.string.alphanumeric(10).toUpperCase(),
          start: new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate(),
          ),
          end: new Date(
            endDate.getFullYear(),
            endDate.getMonth(),
            endDate.getDate(),
          ),
          places: faker.number.int({ min: 1, max: 100 }),
          timeout: new Date(
            timeoutDate.getFullYear(),
            timeoutDate.getMonth(),
            timeoutDate.getDate(),
          ),
          comment: faker.lorem.sentence().substring(0, 45),
          licenseTypes: faker.helpers.arrayElement(licenseTypes),
        };
      },
    );

    const licenses = licensesData.map((data) =>
      this.licenseRepository.create(data),
    );
    return await this.licenseRepository.save(licenses);
  }

  private async seedStands(employees: Employees[]): Promise<Stands[]> {
    const standTypes = await this.standTypesRepository.find();
    const standsData = Array.from({ length: 20 }, () => ({
      parentId: faker.number.int({ min: 0, max: 5 }),
      title: faker.commerce.productName().substring(0, 45),
      image: faker.image.url(),
      width: `${faker.number.int({ min: 100, max: 1000 })}`,
      height: `${faker.number.int({ min: 100, max: 1000 })}`,
      thickness: `${faker.number.int({ min: 10, max: 100 })}`,
      weightNetto: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
      weightBrutto: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
      link: faker.internet.url().substring(0, 100),
      vendorCode: faker.string.alphanumeric(10).toUpperCase(),
      manufactureTime: faker.date.future(),
      comment: faker.lorem.sentence().substring(0, 45),
      standType: faker.helpers.arrayElement(standTypes),
      employees: faker.helpers.arrayElement(employees),
    }));

    const stands = standsData.map((data) => this.standsRepository.create(data));
    return await this.standsRepository.save(stands);
  }

  private async seedStandPackages(stands: Stands[]): Promise<StandPackages[]> {
    const standPackagesData = stands.map((stand) => ({
      width: faker.number.float({ min: 100, max: 1000, fractionDigits: 2 }),
      height: faker.number.float({ min: 100, max: 1000, fractionDigits: 2 }),
      thickness: faker.number.float({ min: 10, max: 100, fractionDigits: 2 }),
      weight: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
      image: faker.image.url().substring(0, 100),
      comment: faker.lorem.sentence().substring(0, 45),
      stands: stand,
    }));

    const standPackages = standPackagesData.map((data) =>
      this.standPackagesRepository.create(data),
    );
    return await this.standPackagesRepository.save(standPackages);
  }

  private async seedPCBS(stands: Stands[]): Promise<PCBS[]> {
    const components = await this.componentsRepository.find();
    const pcbsData = stands.map((stand) => ({
      parentId: faker.number.int({ min: 0, max: 10 }),
      component: faker.helpers.arrayElement(components),
      stands: stand,
    }));

    const pcbs = pcbsData.map((data) => this.pcbsRepository.create(data));
    return await this.pcbsRepository.save(pcbs);
  }

  private async seedOrdersAndShipments(): Promise<void> {
    console.log('Начинаем заполнение заказов и отправок...');

    const orderRequests = await this.seedOrderRequests();
    console.log(`Создано ${orderRequests.length} заявок на заказ`);

    const orderRequestComponents = await this.seedOrderRequestsComponents();
    console.log(`Создано ${orderRequestComponents.length} компонентов заявок на заказ`);

    const pcbOrders = await this.seedPcbOrders();
    console.log(`Создано ${pcbOrders.length} заказов PCB`);

    const shipments = await this.seedShipments();
    console.log(`Создано ${shipments.length} отправок`);

    const shipmentTrips = await this.seedShipmentTrips(shipments);
    console.log(`Создано ${shipmentTrips.length} поездок отправок`);

    const shipmentPackages = await this.seedShipmentPackages(shipments);
    console.log(`Создано ${shipmentPackages.length} пакетов отправок`);

    await this.seedPcbsComponents();
    await this.seedOrderRequestsComponents();
  }

  private async seedOrderRequests(): Promise<OrderRequests[]> {
    const employees = await this.employeesRepository.find();
    const organizations = await this.organizationsRepository.find();

    const orderRequestsData = Array.from({ length: 30 }, () => {
      const requestDate = faker.date.past();
      const completionDate = faker.date.future();

      return {
        title: faker.commerce.productName().substring(0, 45),
        requestDatetime: new Date(
          requestDate.getFullYear(),
          requestDate.getMonth(),
          requestDate.getDate(),
        ),
        executionDatetime: new Date(
          completionDate.getFullYear(),
          completionDate.getMonth(),
          completionDate.getDate(),
        ),
        comment: faker.lorem.sentence().substring(0, 45),
        employeeCreator: faker.helpers.arrayElement(employees),
        factory: faker.helpers.arrayElement(organizations),
      };
    });

    const orderRequests = orderRequestsData.map((data) =>
      this.orderRequestsRepository.create(data),
    );
    return await this.orderRequestsRepository.save(orderRequests);
  }

  private async seedOrderRequestsComponents(): Promise<OrderRequestsComponents[]> {
    const orderRequests = await this.orderRequestsRepository.find();
    const components = await this.componentsRepository.find();
    const organizations = await this.organizationsRepository.find();
    
    const data = Array.from({ length: 30 }, () => ({
      orderRequests: faker.helpers.arrayElement(orderRequests),
      component: faker.helpers.arrayElement(components),
      componentCount: faker.number.int({ min: 1, max: 10 }),
      link: faker.internet.url().substring(0, 255),
      comment: faker.lorem.sentence().substring(0, 45),
      supplier: faker.helpers.arrayElement(organizations),
    }));
    const entities = data.map((d) => this.orderRequestsComponentsRepository.create(d));
    return await this.orderRequestsComponentsRepository.save(entities);
  }

  private async seedOrderRequestComponents(): Promise<OrderRequestComponents[]> {
    const orderRequests = await this.orderRequestsRepository.find();
    const components = await this.componentsRepository.find();
    
    const data = Array.from({ length: 25 }, () => ({
      orderRequests: faker.helpers.arrayElement(orderRequests),
      component: faker.helpers.arrayElement(components),
    }));
    const entities = data.map((d) => this.orderRequestComponentsRepository.create(d));
    return await this.orderRequestComponentsRepository.save(entities);
  }

  private async seedPcbOrders(): Promise<PcbOrders[]> {
    const pcbs = await this.pcbsRepository.find();
    const organizations = await this.organizationsRepository.find();
    const employees = await this.employeesRepository.find();
    const pcbOrderStates = await this.pcbOrderStatesRepository.find();

    const pcbOrdersData = pcbs.map((pcb) => {
      const randomManufacturer = faker.helpers.arrayElement(organizations);
      const randomFactory = faker.helpers.arrayElement(organizations);
      const randomEmployee = faker.helpers.arrayElement(employees);
      const randomState = faker.helpers.arrayElement(pcbOrderStates);

      return {
        billNumber: faker.string.alphanumeric(10).toUpperCase().substring(0, 45),
        count: faker.number.int({ min: 1, max: 100 }),
        width: faker.number.float({ min: 10, max: 500, fractionDigits: 2 }),
        height: faker.number.float({ min: 10, max: 500, fractionDigits: 2 }),
        thickness: faker.number.float({ min: 0.1, max: 5, fractionDigits: 2 }),
        article: faker.string.alphanumeric(8).toUpperCase().substring(0, 45),
        price: faker.number.float({ min: 100, max: 10000, fractionDigits: 2 }),
        pcb: pcb,
        pcbManufacturer: randomManufacturer,
        factory: randomFactory,
        employees: randomEmployee,
        pcbOrderState: randomState,
      };
    });

    const pcbOrders = pcbOrdersData.map((data) =>
      this.pcbOrdersRepository.create(data),
    );
    return await this.pcbOrdersRepository.save(pcbOrders);
  }

  private async seedShipments(): Promise<Shipments[]> {
    const organizations = await this.organizationsRepository.find({
      relations: ['organizationTypes'],
    });
    const licenses = await this.licenseRepository.find();
    const stands = await this.standsRepository.find();

    const factories = organizations.filter(
      (org) =>
        org.organizationTypes?.title?.toLowerCase().includes('производитель') ||
        org.organizationTypes?.title?.toLowerCase().includes('factory'),
    );
    const transporters = organizations.filter(
      (org) =>
        org.organizationTypes?.title?.toLowerCase().includes('перевозчик') ||
        org.organizationTypes?.title?.toLowerCase().includes('transporter'),
    );
    const clients = organizations.filter(
      (org) =>
        org.organizationTypes?.title?.toLowerCase().includes('клиент') ||
        org.organizationTypes?.title?.toLowerCase().includes('client'),
    );

    if (!factories.length || !transporters.length || !clients.length) {
      this.logger.warn(
        'Недостаточно организаций с нужными типами для создания отправок',
      );
      return [];
    }

    // Проверяем, какие лицензии уже используются в отправках
    const existingShipments = await this.shipmentsRepository.find({
      relations: ['licenses'],
    });
    const usedLicenseIds = new Set(existingShipments.map(s => s.licenses?.id).filter(id => id !== undefined));
    
    // Фильтруем только неиспользованные лицензии
    const availableLicenses = licenses.filter(license => !usedLicenseIds.has(license.id));
    
    if (availableLicenses.length === 0) {
      this.logger.warn('Все лицензии уже используются в отправках');
      return [];
    }

    // Используем только доступные лицензии и стенды
    const shipmentsCount = Math.min(stands.length, availableLicenses.length);
    const selectedStands = faker.helpers.arrayElements(stands, shipmentsCount);
    const selectedLicenses = faker.helpers.arrayElements(availableLicenses, shipmentsCount);

    const shipmentsData = selectedStands.map((stand, index) => {
      const randomFactory = faker.helpers.arrayElement(factories);
      const randomTransporter = faker.helpers.arrayElement(transporters);
      const randomClient = faker.helpers.arrayElement(clients);
      const license = selectedLicenses[index];

      return {
        price: faker.number.float({
          min: 1000,
          max: 100000,
          fractionDigits: 2,
        }),
        standNumber: faker.string.alphanumeric(8).toUpperCase(),
        addedDate: faker.date.past(),
        shipmentDate: faker.date.future(),
        specification: faker.lorem.sentence(),
        comment: faker.lorem.sentence(),
        factory: randomFactory,
        transporter: randomTransporter,
        client: randomClient,
        licenses: license,
      };
    });

    const shipments = shipmentsData.map((data) =>
      this.shipmentsRepository.create(data),
    );
    return await this.shipmentsRepository.save(shipments);
  }

  private async seedShipmentTrips(
    shipments: Shipments[],
  ): Promise<ShipmentTrips[]> {
    const employees = await this.employeesRepository.find();

    const shipmentTripsData = shipments.map((shipment) => {
      const randomEmployee = faker.helpers.arrayElement(employees);
      return {
        tripStartDate: shipment.addedDate,
        tripEndDate: shipment.shipmentDate,
        shipments: shipment,
        employees: randomEmployee,
      };
    });

    const shipmentTrips = shipmentTripsData.map((data) =>
      this.shipmentTripsRepository.create(data),
    );
    return await this.shipmentTripsRepository.save(shipmentTrips);
  }

  private async seedShipmentPackages(
    shipments: Shipments[],
  ): Promise<ShipmentPackage[]> {
    const shipmentPackageStates = await this.shipmentPackageStatesRepository.find();

    const shipmentPackagesData = shipments.flatMap((shipment) => {
      const packageCount = faker.number.int({ min: 1, max: 5 });
      return Array(packageCount)
        .fill(null)
        .map(() => {
          const randomState = faker.helpers.arrayElement(shipmentPackageStates);
          return {
            size: `${faker.number.int({ min: 1, max: 100 })}x${faker.number.int({ min: 1, max: 100 })}x${faker.number.int({ min: 1, max: 100 })}`.substring(0, 100),
            photo: faker.image.url(),
            shipments: shipment,
            shipmentPackageStates: randomState,
          };
        });
    });

    const shipmentPackages = shipmentPackagesData.map((data) =>
      this.shipmentPackageRepository.create(data),
    );
    return await this.shipmentPackageRepository.save(shipmentPackages);
  }

  private generateRandomDate(start: Date, end: Date): Date {
    return faker.date.between({ from: start, to: end });
  }

  private generateRandomEmail(firstName: string, lastName: string): string {
    return faker.internet.email({ firstName, lastName }).toLowerCase();
  }

  private async seedAdditionalEntities(mainEntities: any) {
    this.logger.log('Заполнение дополнительных сущностей...');

    // Заполнение справочных данных
    const writeoffReasons = await this.seedWriteoffReasons();
    this.logger.log(`Создано ${writeoffReasons.length} причин списания`);

    const componentPlacementTypes = await this.seedComponentPlacementTypes();
    this.logger.log(`Создано ${componentPlacementTypes.length} типов размещения компонентов`);

    const componentPlacements = await this.seedComponentPlacements();
    this.logger.log(`Создано ${componentPlacements.length} размещений компонентов`);

    // Заполнение задач стендов
    const standTasks = await this.seedStandTasks(mainEntities.stands);
    this.logger.log(`Создано ${standTasks.length} задач стендов`);

    // Заполнение связей отправок и стендов
    const shipmentsStands = await this.seedShipmentsStands();
    this.logger.log(`Создано ${shipmentsStands.length} связей отправок и стендов`);

    // Теперь можно создавать текущие задачи
    const currentTasks = await this.seedCurrentTasks(mainEntities.employees);
    this.logger.log(`Создано ${currentTasks.length} текущих задач`);

    // Заполнение компонентов задач (должно быть после создания задач)
    await this.seedPcbsComponents();
    await this.seedCurrentTasksComponents();
    await this.seedStandTasksComponents();
    await this.seedOrderRequestsComponents();

    // Заполнение счетов и накладных
    const arrivalInvoices = await this.seedArrivalInvoices();
    this.logger.log(`Создано ${arrivalInvoices.length} накладных прибытия`);

    const billsForPay = await this.seedBillsForPay();
    this.logger.log(`Создано ${billsForPay.length} счетов к оплате`);

    const billsComponents = await this.seedBillsComponents();
    this.logger.log(`Создано ${billsComponents.length} компонентов счетов`);

    const invoicesComponents = await this.seedInvoicesComponents();
    this.logger.log(`Создано ${invoicesComponents.length} компонентов накладных`);

    // Заполнение отпусков сотрудников
    const employeesVacations = await this.seedEmployeesVacations();
    this.logger.log(`Создано ${employeesVacations.length} отпусков сотрудников`);

    // Заполнение инвентаризации
    const inventarization = await this.seedInventarization();
    this.logger.log(`Создано ${inventarization.length} записей инвентаризации`);

    // Заполнение серверных операций
    const serverArrivals = await this.seedServerArrivals();
    this.logger.log(`Создано ${serverArrivals.length} серверных прибытий`);

    const serverWriteoff = await this.seedServerWriteoff();
    this.logger.log(`Создано ${serverWriteoff.length} серверных списаний`);

    // Заполнение поставщиков компонентов
    const supplierComponents = await this.seedSupplierComponents();
    this.logger.log(`Создано ${supplierComponents.length} поставщиков компонентов`);

    // Заполнение списаний
    const writeoff = await this.seedWriteoff();
    this.logger.log(`Создано ${writeoff.length} списаний`);

    // Заполнение компонентов заявок (простая связь)
    const orderRequestComponents = await this.seedOrderRequestComponents();
    this.logger.log(`Создано ${orderRequestComponents.length} простых связей компонентов заявок`);
  }

  private async seedCurrentTasks(
    employees: Employees[],
  ): Promise<CurrentTasks[]> {
    const currentTaskStates = await this.currentTaskStatesRepository.find();
    const shipmentsStands = await this.shipmentsStandsRepository.find();
    const standTasks = await this.standTasksRepository.find();

    // Проверяем, что есть все необходимые данные
    if (!employees.length || !currentTaskStates.length || !shipmentsStands.length || !standTasks.length) {
      this.logger.warn('Недостаточно данных для создания текущих задач');
      return [];
    }

    const tasksData = Array.from({ length: 30 }, () => ({
      deadline: faker.date.future(),
      title: faker.commerce.productName().substring(0, 45),
      employees: faker.helpers.arrayElement(employees),
      currentTaskStates: faker.helpers.arrayElement(currentTaskStates),
      shipmentsStands: faker.helpers.arrayElement(shipmentsStands),
      standTasks: faker.helpers.arrayElement(standTasks),
    }));

    const tasks = tasksData.map((data) =>
      this.currentTasksRepository.create(data),
    );
    return await this.currentTasksRepository.save(tasks);
  }

  private async seedPcbsComponents(): Promise<PcbsComponents[]> {
    const pcbs = await this.pcbsRepository.find();
    const components = await this.componentsRepository.find();
    
    // Проверяем, что есть PCB и компоненты
    if (!pcbs.length || !components.length) {
      this.logger.warn('Нет PCB или компонентов для создания компонентов PCB');
      return [];
    }
    
    const data = Array.from({ length: 30 }, () => ({
      pcb: faker.helpers.arrayElement(pcbs),
      component: faker.helpers.arrayElement(components),
      componentCount: faker.number.int({ min: 1, max: 10 }),
    }));
    const entities = data.map((d) => this.pcbsComponentsRepository.create(d));
    return await this.pcbsComponentsRepository.save(entities);
  }

  private async seedCurrentTasksComponents(): Promise<CurrentTasksComponents[]> {
    const tasks = await this.currentTasksRepository.find();
    const components = await this.componentsRepository.find();
    
    // Проверяем, что есть задачи и компоненты
    if (!tasks.length || !components.length) {
      this.logger.warn('Нет задач или компонентов для создания компонентов текущих задач');
      return [];
    }
    
    const data = Array.from({ length: 30 }, () => ({
      currentTask: faker.helpers.arrayElement(tasks),
      component: faker.helpers.arrayElement(components),
      componentCount: faker.number.int({ min: 1, max: 10 }),
      warehouseComponentCount: faker.number.int({ min: 0, max: 10 }),
    }));
    const entities = data.map((d) => this.currentTasksComponentsRepository.create(d));
    return await this.currentTasksComponentsRepository.save(entities);
  }

  private async seedStandTasksComponents(): Promise<StandTasksComponents[]> {
    const standTasks = await this.standTasksRepository.find();
    const components = await this.componentsRepository.find();
    
    // Проверяем, что есть задачи стендов и компоненты
    if (!standTasks.length || !components.length) {
      this.logger.warn('Нет задач стендов или компонентов для создания компонентов задач стендов');
      return [];
    }
    
    const data = Array.from({ length: 30 }, () => ({
      standTask: faker.helpers.arrayElement(standTasks),
      component: faker.helpers.arrayElement(components),
      componentCount: faker.number.int({ min: 1, max: 10 }),
    }));
    const entities = data.map((d) => this.standTasksComponentsRepository.create(d));
    return await this.standTasksComponentsRepository.save(entities);
  }

  private async seedStandTasks(stands: Stands[]): Promise<StandTasks[]> {
    const professions = await this.professionsRepository.find();
    const components = await this.componentsRepository.find();

    // Проверяем, что есть профессии и компоненты
    if (!stands.length || !professions.length || !components.length) {
      this.logger.warn('Нет стендов, профессий или компонентов для создания задач стендов');
      return [];
    }

    const standTasksData = stands.map((stand) => ({
      parentId: faker.number.int({ min: 0, max: 10 }),
      order: faker.number.int({ min: 1, max: 100 }),
      componentOutCount: faker.number.int({ min: 1, max: 50 }),
      title: faker.commerce.productName().substring(0, 45),
      photo: faker.image.url().substring(0, 100),
      manufactureTime: faker.date.future(),
      stands: stand,
      professions: faker.helpers.arrayElement(professions),
      components: faker.helpers.arrayElement(components),
    }));

    const standTasks = standTasksData.map((data) => this.standTasksRepository.create(data));
    return await this.standTasksRepository.save(standTasks);
  }

  private async seedShipmentsStands(): Promise<ShipmentsStands[]> {
    const shipments = await this.shipmentsRepository.find();
    const stands = await this.standsRepository.find();

    const shipmentsStandsData = shipments.map((shipment) => ({
      shipments: shipment,
      stands: faker.helpers.arrayElement(stands),
    }));

    const shipmentsStands = shipmentsStandsData.map((data) => this.shipmentsStandsRepository.create(data));
    return await this.shipmentsStandsRepository.save(shipmentsStands);
  }

  // Методы заполнения дополнительных таблиц
  private async seedWriteoffReasons(): Promise<WriteoffReasons[]> {
    const reasonsData = [
      { title: 'Повреждение при транспортировке' },
      { title: 'Истечение срока годности' },
      { title: 'Технический брак' },
      { title: 'Устаревшая модель' },
      { title: 'Несоответствие спецификации' },
    ];

    const reasons = reasonsData.map((data) => this.writeoffReasonsRepository.create(data));
    return await this.writeoffReasonsRepository.save(reasons);
  }

  private async seedComponentPlacementTypes(): Promise<ComponentPlacementType[]> {
    const typesData = [
      { title: 'Склад A' },
      { title: 'Склад B' },
      { title: 'Склад C' },
      { title: 'Производственный цех' },
      { title: 'Лаборатория' },
    ];

    const types = typesData.map((data) => this.componentPlacementTypeRepository.create(data));
    return await this.componentPlacementTypeRepository.save(types);
  }

  private async seedComponentPlacements(): Promise<ComponentPlacements[]> {
    const placementTypes = await this.componentPlacementTypeRepository.find();
    
    const placementsData = Array.from({ length: 20 }, () => ({
      building: faker.location.buildingNumber().substring(0, 45),
      room: faker.string.numeric(3).substring(0, 45),
      placementType: faker.helpers.arrayElement(placementTypes),
    }));

    const placements = placementsData.map((data) => this.componentPlacementsRepository.create(data));
    return await this.componentPlacementsRepository.save(placements);
  }

  private async seedArrivalInvoices(): Promise<ArrivalInvoices[]> {
    const organizations = await this.organizationsRepository.find();
    
    const invoicesData = Array.from({ length: 30 }, () => {
      const date = faker.date.past();
      const warehouseDate = faker.date.future();
      
      return {
        date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        scanPhoto: faker.image.url().substring(0, 100),
        dateTimeToWarehouse: new Date(warehouseDate.getFullYear(), warehouseDate.getMonth(), warehouseDate.getDate()),
        price: faker.number.float({ min: 1000, max: 50000, fractionDigits: 2 }),
        vat: faker.datatype.boolean(),
        suppliers: faker.helpers.arrayElement(organizations),
        factory: faker.helpers.arrayElement(organizations),
      };
    });

    const invoices = invoicesData.map((data) => this.arrivalInvoicesRepository.create(data));
    return await this.arrivalInvoicesRepository.save(invoices);
  }

  private async seedBillsForPay(): Promise<BillsForPay[]> {
    const organizations = await this.organizationsRepository.find();
    
    const billsData = Array.from({ length: 25 }, () => {
      const date = faker.date.past();
      const supplyDate = faker.date.future();
      
      return {
        date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        scanPhoto: faker.image.url().substring(0, 45),
        expectedSupplyDate: new Date(supplyDate.getFullYear(), supplyDate.getMonth(), supplyDate.getDate()),
        totalAmount: faker.number.float({ min: 5000, max: 100000, fractionDigits: 2 }),
        vat: faker.datatype.boolean(),
        link: faker.internet.url().substring(0, 45),
        supplier: faker.helpers.arrayElement(organizations),
        factory: faker.helpers.arrayElement(organizations),
      };
    });

    const bills = billsData.map((data) => this.billsForPayRepository.create(data));
    return await this.billsForPayRepository.save(bills);
  }

  private async seedBillsComponents(): Promise<BillsComponents[]> {
    const bills = await this.billsForPayRepository.find();
    const components = await this.componentsRepository.find();
    
    const billsComponentsData = bills.flatMap((bill) => {
      const componentCount = faker.number.int({ min: 1, max: 5 });
      return Array(componentCount)
        .fill(null)
        .map(() => ({
          componentCount: faker.number.int({ min: 1, max: 100 }),
          price: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
          link: faker.internet.url().substring(0, 255),
          bill: bill,
      component: faker.helpers.arrayElement(components),
        }));
    });

    const billsComponents = billsComponentsData.map((data) => this.billsComponentsRepository.create(data));
    return await this.billsComponentsRepository.save(billsComponents);
  }

  private async seedInvoicesComponents(): Promise<InvoicesComponents[]> {
    const arrivalInvoices = await this.arrivalInvoicesRepository.find();
    const components = await this.componentsRepository.find();
    
    const invoicesComponentsData = arrivalInvoices.flatMap((invoice) => {
      const componentCount = faker.number.int({ min: 1, max: 5 });
      return Array(componentCount)
        .fill(null)
        .map(() => ({
          componentCount: faker.number.int({ min: 1, max: 100 }).toString(),
          arrivalInvoices: invoice,
          components: faker.helpers.arrayElement(components),
        }));
    });

    const invoicesComponents = invoicesComponentsData.map((data) => this.invoicesComponentsRepository.create(data));
    return await this.invoicesComponentsRepository.save(invoicesComponents);
  }

  private async seedEmployeesVacations(): Promise<EmployeesVacations[]> {
    const employees = await this.employeesRepository.find();
    const organizations = await this.organizationsRepository.find();
    
    const vacationsData = Array.from({ length: 50 }, () => {
      const startDate = faker.date.past();
      const endDate = faker.date.future();
      
      return {
        startDate: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()),
        endDate: new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()),
        employees: faker.helpers.arrayElement(employees),
        factory: faker.helpers.arrayElement(organizations),
      };
    });

    const vacations = vacationsData.map((data) => this.employeesVacationsRepository.create(data));
    return await this.employeesVacationsRepository.save(vacations);
  }

  private async seedInventarization(): Promise<Inventarization[]> {
    const components = await this.componentsRepository.find();
    const organizations = await this.organizationsRepository.find();
    
    const inventarizationData = Array.from({ length: 40 }, () => {
      const date = faker.date.past();
      
      return {
        inventarizationDate: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        componentCount: faker.number.int({ min: 1, max: 1000 }),
        inventarizationQuality: faker.number.int({ min: 1, max: 100 }),
        component: faker.helpers.arrayElement(components),
        factory: faker.helpers.arrayElement(organizations),
      };
    });

    const inventarization = inventarizationData.map((data) => this.inventarizationRepository.create(data));
    return await this.inventarizationRepository.save(inventarization);
  }

  private async seedServerArrivals(): Promise<ServerArrivals[]> {
    const components = await this.componentsRepository.find();
    const organizations = await this.organizationsRepository.find();
    const currentTasks = await this.currentTasksRepository.find();
    
    const serverArrivalsData = Array.from({ length: 30 }, () => {
      const dateTime = faker.date.past();
      
      return {
        dateTime: new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate()),
        componentCount: faker.number.int({ min: 1, max: 100 }),
        components: faker.helpers.arrayElement(components),
        factory: faker.helpers.arrayElement(organizations),
        currentTasks: faker.helpers.arrayElement(currentTasks),
      };
    });

    const serverArrivals = serverArrivalsData.map((data) => this.serverArrivalsRepository.create(data));
    return await this.serverArrivalsRepository.save(serverArrivals);
  }

  private async seedServerWriteoff(): Promise<ServerWriteoff[]> {
    const components = await this.componentsRepository.find();
    const organizations = await this.organizationsRepository.find();
    const currentTasks = await this.currentTasksRepository.find();
    
    const serverWriteoffData = Array.from({ length: 25 }, () => {
      const dateTime = faker.date.past();
      
      return {
        dateTime: new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate()),
        componentCount: faker.number.int({ min: 1, max: 50 }).toString(),
        components: faker.helpers.arrayElement(components),
        factory: faker.helpers.arrayElement(organizations),
        currentTasks: faker.helpers.arrayElement(currentTasks),
      };
    });

    const serverWriteoff = serverWriteoffData.map((data) => this.serverWriteoffRepository.create(data));
    return await this.serverWriteoffRepository.save(serverWriteoff);
  }

  private async seedSupplierComponents(): Promise<SupplierComponents[]> {
    const components = await this.componentsRepository.find();
    
    const supplierComponentsData = Array.from({ length: 60 }, () => ({
      componentId: faker.helpers.arrayElement(components).id,
      productUrl: faker.internet.url(),
      component: faker.helpers.arrayElement(components),
    }));

    const supplierComponents = supplierComponentsData.map((data) => this.supplierComponentsRepository.create(data));
    return await this.supplierComponentsRepository.save(supplierComponents);
  }

  private async seedWriteoff(): Promise<Writeoff[]> {
    const components = await this.componentsRepository.find();
    const organizations = await this.organizationsRepository.find();
    const writeoffReasons = await this.writeoffReasonsRepository.find();
    
    const writeoffData = Array.from({ length: 35 }, () => {
      const dateTime = faker.date.past();
      
      return {
        dateTime: new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate()),
        count: faker.number.int({ min: 1, max: 100 }),
        comment: faker.lorem.sentence(),
        writeoffReasons: faker.helpers.arrayElement(writeoffReasons),
        components: faker.helpers.arrayElement(components),
        factory: faker.helpers.arrayElement(organizations),
      };
    });

    const writeoff = writeoffData.map((data) => this.writeoffRepository.create(data));
    return await this.writeoffRepository.save(writeoff);
  }
}
