import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker/locale/ru';
import { Countries } from '../countries/countries.entity';
import { Region } from '../region/region.entity';
import { Locations } from '../locations/locations.entity';
import { OrganizationTypes } from '../organization-types/organization-types.entity';
import { LicenseTypes } from '../license-types/license-types.entity';
import { EmployeeStates } from '../employee-states/employee-states.entity';
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
import { EmployeeTasks } from '../employee-tasks/employee-tasks.entity';
import { InvoicesArrival } from '../Invoices_arrival/Invoices_arrival.entity';
import { PaymentInvoice } from '../Payment_invoice/Payment_invoice.entity';
import { SendingBoxes } from '../sending_boxes/sending_boxes.entity';
import { StandCourses } from '../stand-courses/stand-courses.entity';
import { TaskStatus } from '../current-tasks/current-tasks.entity';
import { Suppliers } from '../suppliers/suppliers.entity';
import { TaskTypes } from '../task-types/task-types.entity';
import { SupplierComponents } from '../supplier-components/supplier-components.entity';

@Injectable()
export class DatabaseSeederService {
  private readonly logger = new Logger(DatabaseSeederService.name);

  constructor(
    @InjectRepository(Countries)
    private readonly countriesRepository: Repository<Countries>,
    @InjectRepository(Region)
    private readonly regionRepository: Repository<Region>,
    @InjectRepository(Locations)
    private readonly locationsRepository: Repository<Locations>,
    @InjectRepository(OrganizationTypes)
    private readonly organizationTypesRepository: Repository<OrganizationTypes>,
    @InjectRepository(LicenseTypes)
    private readonly licenseTypesRepository: Repository<LicenseTypes>,
    @InjectRepository(EmployeeStates)
    private readonly employeeStatesRepository: Repository<EmployeeStates>,
    @InjectRepository(Professions)
    private readonly professionsRepository: Repository<Professions>,
    @InjectRepository(Departments)
    private readonly departmentsRepository: Repository<Departments>,
    @InjectRepository(StandsTypes)
    private readonly standTypesRepository: Repository<StandsTypes>,
    @InjectRepository(StandCategories)
    private readonly standCategoriesRepository: Repository<StandCategories>,
    @InjectRepository(ShipmentStates)
    private readonly shipmentStatesRepository: Repository<ShipmentStates>,
    @InjectRepository(ShipmentPackageStates)
    private readonly shipmentPackageStatesRepository: Repository<ShipmentPackageStates>,
    @InjectRepository(OrderTypes)
    private readonly orderTypesRepository: Repository<OrderTypes>,
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
    @InjectRepository(StandAssemblies)
    private readonly standAssembliesRepository: Repository<StandAssemblies>,
    @InjectRepository(StandPackages)
    private readonly standPackagesRepository: Repository<StandPackages>,
    @InjectRepository(Components)
    private readonly componentsRepository: Repository<Components>,
    @InjectRepository(WarehouseComponents)
    private readonly warehouseComponentsRepository: Repository<WarehouseComponents>,
    @InjectRepository(PCBS)
    private readonly pcbsRepository: Repository<PCBS>,
    @InjectRepository(PcbWarehouseComponents)
    private readonly pcbWarehouseComponentsRepository: Repository<PcbWarehouseComponents>,
    @InjectRepository(OrderRequests)
    private readonly orderRequestsRepository: Repository<OrderRequests>,
    @InjectRepository(OrderRequestComponents)
    private readonly orderRequestComponentsRepository: Repository<OrderRequestComponents>,
    @InjectRepository(PcbOrders)
    private readonly pcbOrdersRepository: Repository<PcbOrders>,
    @InjectRepository(Shipments)
    private readonly shipmentsRepository: Repository<Shipments>,
    @InjectRepository(ShipmentTrips)
    private readonly shipmentTripsRepository: Repository<ShipmentTrips>,
    @InjectRepository(ShipmentPackage)
    private readonly shipmentPackageRepository: Repository<ShipmentPackage>,
    @InjectRepository(ComponentsArrivalInvoice)
    private readonly componentsArrivalInvoiceRepository: Repository<ComponentsArrivalInvoice>,
    @InjectRepository(ComponentsInvoice)
    private readonly componentsInvoiceRepository: Repository<ComponentsInvoice>,
    @InjectRepository(CurrentTasks)
    private readonly currentTasksRepository: Repository<CurrentTasks>,
    @InjectRepository(EmployeeTasks)
    private readonly employeeTasksRepository: Repository<EmployeeTasks>,
    @InjectRepository(InvoicesArrival)
    private readonly invoicesArrivalRepository: Repository<InvoicesArrival>,
    @InjectRepository(PaymentInvoice)
    private readonly paymentInvoiceRepository: Repository<PaymentInvoice>,
    @InjectRepository(SendingBoxes)
    private readonly sendingBoxesRepository: Repository<SendingBoxes>,
    @InjectRepository(StandCourses)
    private readonly standCoursesRepository: Repository<StandCourses>,
    @InjectRepository(Suppliers)
    private readonly suppliersRepository: Repository<Suppliers>,
    @InjectRepository(TaskTypes)
    private readonly taskTypesRepository: Repository<TaskTypes>,
    @InjectRepository(SupplierComponents)
    private readonly supplierComponentsRepository: Repository<SupplierComponents>,
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
      await this.seedTaskTypes();
      await this.seedSupplierComponents();
      await this.seedAdditionalEntities(mainEntities);

      this.logger.log('База данных успешно заполнена тестовыми данными!');
    } catch (error) {
      this.logger.error('Ошибка при заполнении базы данных:', error);
      throw error;
    }
  }

  private async seedReferenceData() {
    this.logger.log('Заполнение справочников...');

    // Заполнение стран
    const countries = await this.seedCountries();
    this.logger.log(`Создано ${countries.length} стран`);

    // Заполнение регионов
    const regions = await this.seedRegions(countries);
    this.logger.log(`Создано ${regions.length} регионов`);

    // Заполнение локаций
    const locations = await this.seedLocations(regions);
    this.logger.log(`Создано ${locations.length} локаций`);

    // Заполнение типов организаций
    const organizationTypes = await this.seedOrganizationTypes();
    this.logger.log(`Создано ${organizationTypes.length} типов организаций`);

    // Заполнение типов лицензий
    const licenseTypes = await this.seedLicenseTypes();
    this.logger.log(`Создано ${licenseTypes.length} типов лицензий`);

    // Заполнение статусов сотрудников
    const employeeStates = await this.seedEmployeeStates();
    this.logger.log(`Создано ${employeeStates.length} статусов сотрудников`);

    // Заполнение отделов
    const departments = await this.seedDepartments();
    this.logger.log(`Создано ${departments.length} отделов`);

    // Заполнение типов стендов
    const standTypes = await this.seedStandTypes();
    this.logger.log(`Создано ${standTypes.length} типов стендов`);

    // Заполнение категорий стендов
    const standCategories = await this.seedStandCategories();
    this.logger.log(`Создано ${standCategories.length} категорий стендов`);

    // Заполнение статусов отправок
    const shipmentStates = await this.seedShipmentStates();
    this.logger.log(`Создано ${shipmentStates.length} статусов отправок`);

    // Заполнение статусов пакетов отправок
    const shipmentPackageStates = await this.seedShipmentPackageStates();
    this.logger.log(`Создано ${shipmentPackageStates.length} статусов пакетов отправок`);

    // Заполнение типов заказов
    const orderTypes = await this.seedOrderTypes();
    this.logger.log(`Создано ${orderTypes.length} типов заказов`);

    // Заполнение статусов заказов PCB
    const pcbOrderStates = await this.seedPcbOrderStates();
    this.logger.log(`Создано ${pcbOrderStates.length} статусов заказов PCB`);

    return {
      countries,
      regions,
      locations,
      organizationTypes,
      licenseTypes,
      employeeStates,
      departments,
      standTypes,
      standCategories,
      shipmentStates,
      shipmentPackageStates,
      orderTypes,
      pcbOrderStates,
    };
  }

  private async seedCountries(): Promise<Countries[]> {
    const countriesData = [
      { name: 'Россия', image: 'russia.png' },
      { name: 'Казахстан', image: 'kazakhstan.png' },
      { name: 'Беларусь', image: 'belarus.png' },
      { name: 'Армения', image: 'armenia.png' },
    ];

    const countries = countriesData.map(data => this.countriesRepository.create(data));
    return await this.countriesRepository.save(countries);
  }

  private async seedRegions(countries: Countries[]): Promise<Region[]> {
    const regionsData = [
      { name: 'Центральный федеральный округ', image: 'central.png', country: countries[0] },
      { name: 'Северо-Западный федеральный округ', image: 'northwest.png', country: countries[0] },
      { name: 'Южный федеральный округ', image: 'south.png', country: countries[0] },
      { name: 'Алматы', image: 'almaty.png', country: countries[1] },
      { name: 'Нур-Султан', image: 'nur-sultan.png', country: countries[1] },
      { name: 'Минская область', image: 'minsk.png', country: countries[2] },
      { name: 'Гомельская область', image: 'gomel.png', country: countries[2] },
      { name: 'Ереван', image: 'yerevan.png', country: countries[3] },
    ];

    const regions = regionsData.map(data => this.regionRepository.create(data));
    return await this.regionRepository.save(regions);
  }

  private async seedLocations(regions: Region[]): Promise<Locations[]> {
    const locationsData = [
      { name: 'Москва', timeZone: 'Europe/Moscow', region: regions[0] },
      { name: 'Санкт-Петербург', timeZone: 'Europe/Moscow', region: regions[1] },
      { name: 'Ростов-на-Дону', timeZone: 'Europe/Moscow', region: regions[2] },
      { name: 'Алматы', timeZone: 'Asia/Almaty', region: regions[3] },
      { name: 'Нур-Султан', timeZone: 'Asia/Almaty', region: regions[4] },
      { name: 'Минск', timeZone: 'Europe/Minsk', region: regions[5] },
      { name: 'Гомель', timeZone: 'Europe/Minsk', region: regions[6] },
      { name: 'Ереван', timeZone: 'Asia/Yerevan', region: regions[7] },
    ];

    const locations = locationsData.map(data => this.locationsRepository.create(data));
    return await this.locationsRepository.save(locations);
  }

  private async seedOrganizationTypes(): Promise<OrganizationTypes[]> {
    const typesData = [
      { title: 'Производитель' },
      { title: 'Поставщик' },
      { title: 'Транспортная компания' },
      { title: 'Клиент' },
      { title: 'Партнер' },
    ];

    const types = typesData.map(data => this.organizationTypesRepository.create(data));
    return await this.organizationTypesRepository.save(types);
  }

  private async seedLicenseTypes(): Promise<LicenseTypes[]> {
    const typesData = [
      { name: 'Стандартная' },
      { name: 'Расширенная' },
      { name: 'Корпоративная' },
      { name: 'Пробная' },
    ];

    const types = typesData.map(data => this.licenseTypesRepository.create(data));
    return await this.licenseTypesRepository.save(types);
  }

  private async seedEmployeeStates(): Promise<EmployeeStates[]> {
    const statesData = [
      { title: 'Активен' },
      { title: 'В отпуске' },
      { title: 'На больничном' },
      { title: 'Уволен' },
    ];

    const states = statesData.map(data => this.employeeStatesRepository.create(data));
    return await this.employeeStatesRepository.save(states);
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

    const departments = departmentsData.map(data => this.departmentsRepository.create(data));
    return await this.departmentsRepository.save(departments);
  }

  private async seedStandTypes(): Promise<StandsTypes[]> {
    const typesData = [
      { title: 'Учебный' },
      { title: 'Производственный' },
      { title: 'Тестовый' },
      { title: 'Демонстрационный' },
    ];

    const types = typesData.map(data => this.standTypesRepository.create(data));
    return await this.standTypesRepository.save(types);
  }

  private async seedStandCategories(): Promise<StandCategories[]> {
    const categoriesData = [
      { name: 'Электроника', image: 'electronics.png', comment: 'Электронные стенды' },
      { name: 'Механика', image: 'mechanics.png', comment: 'Механические стенды' },
      { name: 'Гидравлика', image: 'hydraulics.png', comment: 'Гидравлические стенды' },
      { name: 'Пневматика', image: 'pneumatics.png', comment: 'Пневматические стенды' },
    ];

    const categories = categoriesData.map(data => this.standCategoriesRepository.create(data));
    return await this.standCategoriesRepository.save(categories);
  }

  private async seedShipmentStates(): Promise<ShipmentStates[]> {
    const statesData = [
      { title: 'В обработке' },
      { title: 'Готов к отправке' },
      { title: 'В пути' },
      { title: 'Доставлен' },
      { title: 'Отменен' },
    ];

    const states = statesData.map(data => this.shipmentStatesRepository.create(data));
    return await this.shipmentStatesRepository.save(states);
  }

  private async seedShipmentPackageStates(): Promise<ShipmentPackageStates[]> {
    const statesData = [
      { title: 'Упакован' },
      { title: 'В пути' },
      { title: 'Доставлен' },
      { title: 'Поврежден' },
      { title: 'Утерян' },
    ];

    const states = statesData.map(data => this.shipmentPackageStatesRepository.create(data));
    return await this.shipmentPackageStatesRepository.save(states);
  }

  private async seedOrderTypes(): Promise<OrderTypes[]> {
    const typesData = [
      { title: 'Стандартный' },
      { title: 'Срочный' },
      { title: 'Оптовый' },
      { title: 'Пробный' },
    ];

    const types = typesData.map(data => this.orderTypesRepository.create(data));
    return await this.orderTypesRepository.save(types);
  }

  private async seedPcbOrderStates(): Promise<PcbOrderStates[]> {
    const statesData = [
      { state: 'Новый' },
      { state: 'В производстве' },
      { state: 'Готов' },
      { state: 'Отправлен' },
      { state: 'Отменен' },
    ];

    const states = statesData.map(data => this.pcbOrderStatesRepository.create(data));
    return await this.pcbOrderStatesRepository.save(states);
  }

  private async seedMainEntities() {
    this.logger.log('Заполнение основных сущностей...');

    const peoples = await this.seedPeoples();
    this.logger.log(`Создано ${peoples.length} людей`);

    const organizations = await this.seedOrganizations(peoples);
    this.logger.log(`Создано ${organizations.length} организаций`);

    const suppliers = await this.seedSuppliers();
    this.logger.log(`Создано ${suppliers.length} поставщиков`);

    const employees = await this.seedEmployees(peoples);
    this.logger.log(`Создано ${employees.length} сотрудников`);

    const employeeDepartments = await this.seedEmployeeDepartments(employees);
    this.logger.log(`Создано ${employeeDepartments.length} связей сотрудников с отделами`);

    const licenses = await this.seedLicenses(organizations);
    this.logger.log(`Создано ${licenses.length} лицензий`);

    const stands = await this.seedStands(employees);
    this.logger.log(`Создано ${stands.length} стендов`);

    const standAssemblies = await this.seedStandAssemblies(stands);
    this.logger.log(`Создано ${standAssemblies.length} сборок стендов`);

    const standPackages = await this.seedStandPackages(stands);
    this.logger.log(`Создано ${standPackages.length} упаковок стендов`);

    const components = await this.seedComponents(suppliers);
    this.logger.log(`Создано ${components.length} компонентов`);

    const warehouseComponents = await this.seedWarehouseComponents(organizations);
    this.logger.log(`Создано ${warehouseComponents.length} складских компонентов`);

    const pcbs = await this.seedPCBS(stands);
    this.logger.log(`Создано ${pcbs.length} печатных плат`);

    const pcbWarehouseComponents = await this.seedPcbWarehouseComponents(warehouseComponents);
    this.logger.log(`Создано ${pcbWarehouseComponents.length} складских компонентов для печатных плат`);

    return {
      peoples,
      organizations,
      suppliers,
      employees,
      employeeDepartments,
      licenses,
      stands,
      standAssemblies,
      standPackages,
      components,
      warehouseComponents,
      pcbs,
      pcbWarehouseComponents,
    };
  }

  private async seedPeoples(): Promise<Peoples[]> {
    const peoplesData = Array.from({ length: 20 }, () => ({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      middleName: faker.person.middleName(),
      phone: this.generateRandomPhone(),
      email: faker.internet.email(),
      comment: faker.lorem.sentence(),
    }));

    const peoples = peoplesData.map(data => this.peoplesRepository.create(data));
    return await this.peoplesRepository.save(peoples);
  }

  private async seedOrganizations(peoples: Peoples[]): Promise<Organizations[]> {
    const organizationTypes = await this.organizationTypesRepository.find();
    const organizationsData = Array.from({ length: 15 }, (_, index) => {
      const orgnDate = faker.date.past();
      return {
        parentId: index === 0 ? '0' : String(Math.floor(Math.random() * index) + 1),
        fullName: faker.company.name(),
        shortName: faker.company.name(),
        lawAddress: faker.location.streetAddress(),
        factAddress: faker.location.streetAddress(),
        postAddress: faker.location.streetAddress(),
        inn: faker.string.numeric(10),
        kpp: faker.string.numeric(9),
        orgn: faker.string.numeric(13),
        orgnDate: new Date(orgnDate.getFullYear(), orgnDate.getMonth(), orgnDate.getDate()),
        phone: this.generateRandomPhone(),
        email: faker.internet.email(),
        digitalDocs: faker.number.int({ min: 0, max: 1 }),
        rating: faker.number.int({ min: 1, max: 5 }),
        comment: faker.lorem.sentence(),
        peoples: faker.helpers.arrayElement(peoples),
        organizationTypes: faker.helpers.arrayElement(organizationTypes),
      };
    });

    const organizations = organizationsData.map(data => this.organizationsRepository.create(data));
    return await this.organizationsRepository.save(organizations);
  }

  private async seedSuppliers(): Promise<Suppliers[]> {
    const suppliersData = Array.from({ length: 20 }, () => {
      const ogrnDate = faker.date.past();
      return {
        inn: faker.string.numeric(10),
        kpp: faker.string.numeric(9),
        ogrn: faker.string.numeric(13),
        ogrnDate: new Date(ogrnDate.getFullYear(), ogrnDate.getMonth(), ogrnDate.getDate()),
        name: faker.company.name(),
        shortName: faker.company.name(),
        legalAddress: faker.location.streetAddress(),
        postalAddress: faker.location.streetAddress(),
        hasElectronicDocumentFlow: faker.datatype.boolean(),
        contactPhones: this.generateRandomPhone(),
        email: faker.internet.email(),
        contactPerson: faker.person.fullName(),
      };
    });

    const suppliers = suppliersData.map(data => this.suppliersRepository.create(data));
    return await this.suppliersRepository.save(suppliers);
  }

  private async seedEmployees(peoples: Peoples[]): Promise<Employees[]> {
    const professions = await this.professionsRepository.find();
    const employeeStates = await this.employeeStatesRepository.find();

    if (peoples.length === 0 || professions.length === 0 || employeeStates.length === 0) {
      console.log('No peoples, professions or employee states found to create employees');
      return [];
    }

    // Создаем массив сотрудников с передачей объектов-связей
    const employees = peoples.map((people) => {
      const randomProfession = faker.helpers.arrayElement(professions);
      const randomState = faker.helpers.arrayElement(employeeStates);
      const birthDate = faker.date.past({ years: 30 });
      
      return this.employeesRepository.create({
        birthDate: new Date(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getDate()),
        peoples: people, // объект people
        profession: randomProfession, // объект профессии
        employeeStates: randomState // объект состояния
      });
    });

    const createdEmployees = await this.employeesRepository.save(employees);
    console.log(`Created ${createdEmployees.length} employees with professions and states`);
    return createdEmployees;
  }

  private async seedEmployeeDepartments(employees: Employees[]): Promise<EmployeeDepartments[]> {
    const departments = await this.departmentsRepository.find();
    const employeeDepartmentsData = employees.flatMap(employee => 
      faker.helpers.arrayElements(departments, { min: 1, max: 3 }).map(department => ({
        employees: employee,
        departments: department,
      }))
    );

    const employeeDepartments = employeeDepartmentsData.map(data => 
      this.employeeDepartmentsRepository.create(data)
    );
    return await this.employeeDepartmentsRepository.save(employeeDepartments);
  }

  private async seedLicenses(organizations: Organizations[]): Promise<License[]> {
    const licenseTypes = await this.licenseTypesRepository.find();
    const licensesData = Array.from({ length: 10 }, () => {
      // Генерируем только даты без времени
      const startDate = faker.date.past();
      const endDate = faker.date.future();
      const timeoutDate = faker.date.future();
      
      return {
        licenseCode: faker.string.alphanumeric(10).toUpperCase(),
        start: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()),
        end: new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()),
        places: faker.number.int({ min: 1, max: 100 }),
        timeout: new Date(timeoutDate.getFullYear(), timeoutDate.getMonth(), timeoutDate.getDate()),
        comment: faker.lorem.sentence(),
        licenseTypes: faker.helpers.arrayElement(licenseTypes),
      };
    });

    const licenses = licensesData.map(data => this.licenseRepository.create(data));
    return await this.licenseRepository.save(licenses);
  }

  private async seedStands(employees: Employees[]): Promise<Stands[]> {
    const standTypes = await this.standTypesRepository.find();
    const standCategories = await this.standCategoriesRepository.find();
    const standsData = Array.from({ length: 20 }, () => ({
      parentId: faker.number.int({ min: 0, max: 5 }),
      title: faker.commerce.productName(),
      image: faker.image.url(),
      size: `${faker.number.int({ min: 100, max: 1000 })}x${faker.number.int({ min: 100, max: 1000 })}x${faker.number.int({ min: 100, max: 1000 })}`,
      weight: faker.number.int({ min: 10, max: 1000 }),
      link: faker.internet.url(),
      vendorCode: faker.string.alphanumeric(10).toUpperCase(),
      comment: faker.lorem.sentence(),
      standType: faker.helpers.arrayElement(standTypes),
      employees: faker.helpers.arrayElement(employees),
    }));

    const stands = standsData.map(data => this.standsRepository.create(data));
    return await this.standsRepository.save(stands);
  }

  private async seedStandAssemblies(stands: Stands[]): Promise<StandAssemblies[]> {
    const standAssembliesData = stands.map(stand => ({
      stands: stand,
      title: `Сборка ${stand.title}`,
      comment: faker.lorem.sentence(),
    }));

    const standAssemblies = standAssembliesData.map(data => 
      this.standAssembliesRepository.create(data)
    );
    return await this.standAssembliesRepository.save(standAssemblies);
  }

  private async seedStandPackages(stands: Stands[]): Promise<StandPackages[]> {
    const standPackagesData = stands.map(stand => ({
      stands: stand,
      size: `${faker.number.int({ min: 100, max: 1000 })}x${faker.number.int({ min: 100, max: 1000 })}x${faker.number.int({ min: 100, max: 1000 })}`,
      weight: faker.number.int({ min: 10, max: 1000 }).toString(),
      comment: faker.lorem.sentence(),
    }));

    const standPackages = standPackagesData.map(data => 
      this.standPackagesRepository.create(data)
    );
    return await this.standPackagesRepository.save(standPackages);
  }

  private async seedComponents(suppliers: Suppliers[]): Promise<Components[]> {
    const componentsData = Array.from({ length: 50 }, () => {
      const randomSupplier = suppliers[Math.floor(Math.random() * suppliers.length)];
      const receiptDate = faker.date.past();
      
      return {
        parentId: undefined,
        name: faker.commerce.productName(),
        appearance: faker.image.url(),
        dimensions: `${faker.number.int({ min: 10, max: 100 })}x${faker.number.int({ min: 10, max: 100 })}x${faker.number.int({ min: 10, max: 100 })}`,
        weight: faker.number.float({ min: 0.1, max: 10, fractionDigits: 2 }),
        material: faker.commerce.productMaterial(),
        minimumStock: faker.number.int({ min: 1, max: 100 }),
        supplierId: randomSupplier.id,
        receiptDate: new Date(receiptDate.getFullYear(), receiptDate.getMonth(), receiptDate.getDate()),
        drawingReference: faker.string.alphanumeric(10),
      };
    });

    const components = componentsData.map(data => 
      this.componentsRepository.create(data)
    );
    return await this.componentsRepository.save(components);
  }

  private async seedWarehouseComponents(organizations: Organizations[]): Promise<WarehouseComponents[]> {
    const components = await this.componentsRepository.find();
    
    const warehouseComponentsData = components.map(component => {
        const randomOrg = organizations[Math.floor(Math.random() * organizations.length)];
        const arrivalDate = faker.date.past();
        return {
            parentId: component.id,
            title: component.name,
            photo: component.appearance,
            price: faker.number.float({ min: 100, max: 10000, fractionDigits: 2 }),
            count: faker.number.int({ min: 1, max: 100 }),
            size: `${faker.number.int({ min: 1, max: 100 })}x${faker.number.int({ min: 1, max: 100 })}x${faker.number.int({ min: 1, max: 100 })}`,
            weight: faker.number.float({ min: 0.1, max: 10, fractionDigits: 2 }).toString(),
            material: faker.helpers.arrayElement(['Пластик', 'Металл', 'Дерево', 'Стекло']),
            minCount: faker.number.int({ min: 1, max: 10 }).toString(),
            arrivalDate: new Date(arrivalDate.getFullYear(), arrivalDate.getMonth(), arrivalDate.getDate()),
            link: faker.internet.url(),
            organizations: randomOrg
        };
    });

    const warehouseComponents = warehouseComponentsData.map(data => 
        this.warehouseComponentsRepository.create(data)
    );
    return await this.warehouseComponentsRepository.save(warehouseComponents);
  }

  private async seedPCBS(stands: Stands[]): Promise<PCBS[]> {
    const pcbsData = stands.map(stand => ({
      parentId: faker.number.int({ min: 0, max: 5 }),
      stands: stand,
    }));

    const pcbs = pcbsData.map(data => this.pcbsRepository.create(data));
    return await this.pcbsRepository.save(pcbs);
  }

  private async seedPcbWarehouseComponents(warehouseComponents: WarehouseComponents[]): Promise<PcbWarehouseComponents[]> {
    const pcbs = await this.pcbsRepository.find();
    
    const pcbWarehouseComponentsData = pcbs.map(pcb => {
        const randomComponent = warehouseComponents[Math.floor(Math.random() * warehouseComponents.length)];
        return {
            pcbs: pcb,
            warehouseComponents: randomComponent
        };
    });

    const pcbWarehouseComponents = pcbWarehouseComponentsData.map(data => 
        this.pcbWarehouseComponentsRepository.create(data)
    );
    return await this.pcbWarehouseComponentsRepository.save(pcbWarehouseComponents);
  }

  private async seedOrdersAndShipments(): Promise<void> {
    console.log('Начинаем заполнение заказов и отправок...');
    
    const orderRequests = await this.seedOrderRequests();
    console.log(`Создано ${orderRequests.length} заявок на заказ`);
    
    const orderRequestComponents = await this.seedOrderRequestComponents(orderRequests);
    console.log(`Создано ${orderRequestComponents.length} компонентов заявок`);
    
    const pcbOrders = await this.seedPcbOrders();
    console.log(`Создано ${pcbOrders.length} заказов ПП`);
    
    const shipments = await this.seedShipments();
    console.log(`Создано ${shipments.length} отправок`);
    
    const shipmentTrips = await this.seedShipmentTrips(shipments);
    console.log(`Создано ${shipmentTrips.length} поездок`);
    
    const shipmentPackages = await this.seedShipmentPackages(shipments);
    console.log(`Создано ${shipmentPackages.length} упаковок отправок`);
  }

  private async seedOrderRequests(): Promise<OrderRequests[]> {
    const stands = await this.standsRepository.find();
    const employees = await this.employeesRepository.find();
    
    const orderRequestsData = stands.map(stand => {
        const randomCreator = employees[Math.floor(Math.random() * employees.length)];
        const randomExecutor = employees[Math.floor(Math.random() * employees.length)];
        return {
            state: faker.number.int({ min: 1, max: 5 }),
            title: faker.commerce.productName(),
            article: faker.string.alphanumeric(8).toUpperCase(),
            count: faker.number.int({ min: 1, max: 100 }),
            priceForPcs: faker.number.float({ min: 100, max: 10000, fractionDigits: 2 }),
            link: faker.internet.url(),
            comment: faker.lorem.sentence(),
            stands: stand,
            employeeCreator: randomCreator,
            employeeExecutor: randomExecutor
        };
    });

    const orderRequests = orderRequestsData.map(data => 
        this.orderRequestsRepository.create(data)
    );
    return await this.orderRequestsRepository.save(orderRequests);
  }

  private async seedOrderRequestComponents(orderRequests: OrderRequests[]): Promise<OrderRequestComponents[]> {
    const warehouseComponents = await this.warehouseComponentsRepository.find();
    
    const orderRequestComponentsData = orderRequests.flatMap(orderRequest => {
        const componentCount = faker.number.int({ min: 1, max: 5 });
        return Array(componentCount).fill(null).map(() => ({
            orderRequests: orderRequest,
            components: warehouseComponents[Math.floor(Math.random() * warehouseComponents.length)]
        }));
    });

    const orderRequestComponents = orderRequestComponentsData.map(data => 
        this.orderRequestComponentsRepository.create(data)
    );
    return await this.orderRequestComponentsRepository.save(orderRequestComponents);
  }

  private async seedPcbOrders(): Promise<PcbOrders[]> {
    const pcbs = await this.pcbsRepository.find();
    const organizations = await this.organizationsRepository.find();
    const employees = await this.employeesRepository.find();
    const orderTypes = await this.orderTypesRepository.find();
    const pcbOrderStates = await this.pcbOrderStatesRepository.find();
    
    const pcbOrdersData = pcbs.map(pcb => {
        const randomManufacturer = organizations[Math.floor(Math.random() * organizations.length)];
        const randomFactory = organizations[Math.floor(Math.random() * organizations.length)];
        const randomEmployee = employees[Math.floor(Math.random() * employees.length)];
        const randomOrderType = orderTypes[Math.floor(Math.random() * orderTypes.length)];
        const randomState = pcbOrderStates[Math.floor(Math.random() * pcbOrderStates.length)];
        
        return {
            billNumber: faker.number.int({ min: 1000, max: 9999 }),
            count: faker.number.int({ min: 1, max: 100 }).toString(),
            size: `${faker.number.int({ min: 1, max: 100 })}x${faker.number.int({ min: 1, max: 100 })}`,
            thickness: faker.number.float({ min: 0.1, max: 5, fractionDigits: 2 }),
            article: faker.string.alphanumeric(8).toUpperCase(),
            price: faker.number.float({ min: 100, max: 10000, fractionDigits: 2 }).toString(),
            pcbs: pcb,
            manufacturer: randomManufacturer,
            factory: randomFactory,
            orderTypes: randomOrderType,
            employees: randomEmployee,
            pcbOrderState: randomState
        };
    });

    const pcbOrders = pcbOrdersData.map(data => 
        this.pcbOrdersRepository.create(data)
    );
    return await this.pcbOrdersRepository.save(pcbOrders);
  }

  private async seedShipments(): Promise<Shipments[]> {
    const organizations = await this.organizationsRepository.find();
    const standAssemblies = await this.standAssembliesRepository.find();
    const shipmentStates = await this.shipmentStatesRepository.find();
    const licenses = await this.licenseRepository.find();
    const addedDate = faker.date.past();
    const shipmentDate = faker.date.future();

    const usedLicenseIds = new Set<number>();

    const shipmentsData = standAssemblies.map(assembly => {
      const randomFactory = organizations[Math.floor(Math.random() * organizations.length)];
      const randomTransporter = organizations[Math.floor(Math.random() * organizations.length)];
      const randomClient = organizations[Math.floor(Math.random() * organizations.length)];
      const randomState = shipmentStates[Math.floor(Math.random() * shipmentStates.length)];

      // Найти лицензию, которая еще не использовалась
      let randomLicense: License | undefined = undefined;
      if (licenses.length > 0) {
        const availableLicenses = licenses.filter(l => !usedLicenseIds.has(l.id));
        if (availableLicenses.length > 0) {
          randomLicense = faker.helpers.arrayElement(availableLicenses);
          usedLicenseIds.add(randomLicense.id);
        }
      }

      return {
        price: faker.number.float({ min: 1000, max: 100000, fractionDigits: 2 }),
        standNumber: faker.string.alphanumeric(8).toUpperCase(),
        addedDate: new Date(addedDate.getFullYear(), addedDate.getMonth(), addedDate.getDate()),
        shipmentDate: new Date(shipmentDate.getFullYear(), shipmentDate.getMonth(), shipmentDate.getDate()),
        specification: faker.lorem.sentence(),
        comment: faker.lorem.sentence(),
        factory: randomFactory,
        transporter: randomTransporter,
        client: randomClient,
        standAssemblies: assembly,
        shipmentStates: randomState,
        licenses: randomLicense
      };
    });

    const shipments = shipmentsData.map(data => this.shipmentsRepository.create(data));
    return await this.shipmentsRepository.save(shipments);
  }

  private async seedShipmentTrips(shipments: Shipments[]): Promise<ShipmentTrips[]> {
    const employees = await this.employeesRepository.find();
    
    const shipmentTripsData = shipments.map(shipment => {
        const randomEmployee = employees[Math.floor(Math.random() * employees.length)];
        return {
            tripStartDate: shipment.addedDate,
            tripEndDate: shipment.shipmentDate,
            shipments: shipment,
            employees: randomEmployee,
            comment: faker.lorem.sentence()
        };
    });

    const shipmentTrips = shipmentTripsData.map(data => 
        this.shipmentTripsRepository.create(data)
    );
    return await this.shipmentTripsRepository.save(shipmentTrips);
  }

  private async seedShipmentPackages(shipments: Shipments[]): Promise<ShipmentPackage[]> {
    const shipmentPackageStates = await this.shipmentPackageStatesRepository.find();
    
    const shipmentPackagesData = shipments.flatMap(shipment => {
        const packageCount = faker.number.int({ min: 1, max: 5 });
        return Array(packageCount).fill(null).map(() => {
            const randomState = shipmentPackageStates[Math.floor(Math.random() * shipmentPackageStates.length)];
            return {
                size: `${faker.number.int({ min: 1, max: 100 })}x${faker.number.int({ min: 1, max: 100 })}x${faker.number.int({ min: 1, max: 100 })}`,
                photo: faker.image.url(),
                shipments: shipment,
                shipmentPackageStates: randomState
            };
        });
    });

    const shipmentPackages = shipmentPackagesData.map(data => 
        this.shipmentPackageRepository.create(data)
    );
    return await this.shipmentPackageRepository.save(shipmentPackages);
  }

  // Вспомогательные методы для генерации тестовых данных
  private generateRandomDate(start: Date, end: Date): Date {
    return faker.date.between({ from: start, to: end });
  }

  private generateRandomPhone(): string {
    return faker.phone.number({ style: 'national' });
  }

  private generateRandomEmail(firstName: string, lastName: string): string {
    return faker.internet.email({ firstName, lastName }).toLowerCase();
  }

  private async seedAdditionalEntities(mainEntities: any) {
    this.logger.log('Заполнение дополнительных сущностей...');

    // Сначала создаем накладные прихода
    const invoicesArrival = await this.seedInvoicesArrival(mainEntities.suppliers);
    this.logger.log(`Создано ${invoicesArrival.length} накладных на поступление`);

    // Теперь можно создавать связи
    const componentsArrivalInvoices = await this.seedComponentsArrivalInvoices();
    this.logger.log(`Создано ${componentsArrivalInvoices.length} накладных на поступление компонентов`);

    const componentsInvoices = await this.seedComponentsInvoices();
    this.logger.log(`Создано ${componentsInvoices.length} накладных на компоненты`);

    const currentTasks = await this.seedCurrentTasks(mainEntities.employees);
    this.logger.log(`Создано ${currentTasks.length} текущих задач`);

    const employeeTasks = await this.seedEmployeeTasks();
    this.logger.log(`Создано ${employeeTasks.length} задач сотрудников`);

    const paymentInvoices = await this.seedPaymentInvoices(mainEntities.organizations);
    this.logger.log(`Создано ${paymentInvoices.length} платежных накладных`);

    const sendingBoxes = await this.seedSendingBoxes();
    this.logger.log(`Создано ${sendingBoxes.length} отправляемых коробок`);

    const standCourses = await this.seedStandCourses(mainEntities.stands);
    this.logger.log(`Создано ${standCourses.length} курсов по стендам`);
  }

  private async seedComponentsArrivalInvoices(): Promise<ComponentsArrivalInvoice[]> {
    const components = await this.componentsRepository.find();
    const invoicesArrival = await this.invoicesArrivalRepository.find();
    
    const invoicesData = Array.from({ length: 20 }, () => {
      const randomComponent = components[Math.floor(Math.random() * components.length)];
      const randomInvoice = invoicesArrival[Math.floor(Math.random() * invoicesArrival.length)];
      
      return {
        invoiceId: randomInvoice.id,
        componentId: randomComponent.id,
        quantity: faker.number.int({ min: 1, max: 100 }),
      };
    });

    const invoices = invoicesData.map(data => 
      this.componentsArrivalInvoiceRepository.create(data)
    );
    return await this.componentsArrivalInvoiceRepository.save(invoices);
  }

  private async seedComponentsInvoices(): Promise<ComponentsInvoice[]> {
    const components = await this.componentsRepository.find();
    const invoicesArrival = await this.invoicesArrivalRepository.find();
    
    const invoicesData = Array.from({ length: 20 }, () => {
      const randomComponent = components[Math.floor(Math.random() * components.length)];
      const randomInvoice = invoicesArrival[Math.floor(Math.random() * invoicesArrival.length)];
      
      return {
        invoiceId: randomInvoice.id,
        componentId: randomComponent.id,
        quantity: faker.number.int({ min: 1, max: 100 }),
      };
    });

    const invoices = invoicesData.map(data => 
      this.componentsInvoiceRepository.create(data)
    );
    return await this.componentsInvoiceRepository.save(invoices);
  }

  private async seedCurrentTasks(employees: Employees[]): Promise<CurrentTasks[]> {
    const tasksData = Array.from({ length: 30 }, () => ({
      taskId: faker.number.int({ min: 1, max: 1000 }),
      quantity: faker.number.int({ min: 1, max: 10 }),
      status: TaskStatus.NOT_STARTED,
    }));

    const tasks = tasksData.map(data => 
      this.currentTasksRepository.create(data)
    );
    return await this.currentTasksRepository.save(tasks);
  }

  private async seedEmployeeTasks(): Promise<EmployeeTasks[]> {
    const employees = await this.employeesRepository.find();
    const shipments = await this.shipmentsRepository.find();
    const taskTypes = await this.taskTypesRepository.find();

    if (employees.length === 0 || shipments.length === 0 || taskTypes.length === 0) {
      console.log('No employees, shipments or task types found to create employee tasks');
      return [];
    }

    // Создаем родительские задачи
    const parentTasks: Array<Partial<EmployeeTasks>> = [];
    for (let i = 0; i < 10; i++) {
      const expectationTimeout = faker.date.future();
      const parentTask: Partial<EmployeeTasks> = {
        title: faker.company.catchPhrase(),
        photo: faker.image.url(),
        timeout: faker.number.int({ min: 1, max: 24 }).toString() + 'h',
        expectationTimeout: new Date(expectationTimeout.getFullYear(), expectationTimeout.getMonth(), expectationTimeout.getDate()),
        employees: faker.helpers.arrayElement(employees),
        shipments: faker.helpers.arrayElement(shipments),
        parentId: undefined
      };
      parentTasks.push(parentTask);
    }

    // Сохраняем родительские задачи и получаем их с ID
    const createdParentTasks = await this.employeeTasksRepository.save(parentTasks);
    console.log(`Created ${createdParentTasks.length} parent tasks`);

    // Создаем дочерние задачи
    const childTasks: Array<Partial<EmployeeTasks>> = [];
    for (const parentTask of createdParentTasks) {
      // Для каждой родительской задачи создаем 2-4 подзадачи
      const numSubtasks = faker.number.int({ min: 2, max: 4 });
      for (let i = 0; i < numSubtasks; i++) {
        const expectationTimeout = faker.date.future();
        const childTask: Partial<EmployeeTasks> = {
          title: faker.company.catchPhrase(),
          photo: faker.image.url(),
          timeout: faker.number.int({ min: 1, max: 12 }).toString() + 'h',
          expectationTimeout: new Date(expectationTimeout.getFullYear(), expectationTimeout.getMonth(), expectationTimeout.getDate()),
          employees: faker.helpers.arrayElement(employees),
          shipments: parentTask.shipments,
          parentId: parentTask.id
        };
        childTasks.push(childTask);
      }
    }

    // Сохраняем дочерние задачи
    const createdChildTasks = await this.employeeTasksRepository.save(childTasks);
    console.log(`Created ${createdChildTasks.length} child tasks`);

    return [...createdParentTasks, ...createdChildTasks];
  }

  private async seedInvoicesArrival(suppliers: Suppliers[]): Promise<InvoicesArrival[]> {
    const invoicesData = Array.from({ length: 20 }, () => {
      const randomSupplier = suppliers[Math.floor(Math.random() * suppliers.length)];
      const date = faker.date.past();
      
      return {
        supplierId: randomSupplier.id,
        number: faker.string.alphanumeric(10).toUpperCase(),
        date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        comment: faker.lorem.sentence(),
      };
    });

    const invoices = invoicesData.map(data => 
      this.invoicesArrivalRepository.create(data)
    );
    return await this.invoicesArrivalRepository.save(invoices);
  }

  private async seedPaymentInvoices(organizations: Organizations[]): Promise<PaymentInvoice[]> {
    const invoicesData = Array.from({ length: 20 }, () => {
      const randomOrg = organizations[Math.floor(Math.random() * organizations.length)];
      const date = faker.date.past();
      
      return {
        date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        providerId: randomOrg.id,
        invoiceScan: faker.image.url(),
      };
    });

    const invoices = invoicesData.map(data => 
      this.paymentInvoiceRepository.create(data)
    );
    return await this.paymentInvoiceRepository.save(invoices);
  }

  private async seedSendingBoxes(): Promise<SendingBoxes[]> {
    const boxesData = Array.from({ length: 30 }, () => ({
      sendId: faker.number.int({ min: 1, max: 1000 }),
      boxDrawingsId: faker.number.int({ min: 1, max: 1000 }),
    }));

    const boxes = boxesData.map(data => 
      this.sendingBoxesRepository.create(data)
    );
    return await this.sendingBoxesRepository.save(boxes);
  }

  private async seedStandCourses(stands: Stands[]): Promise<StandCourses[]> {
    const coursesData = stands.map(stand => ({
      name: `Курс по стенду ${stand.title}`,
    }));

    const courses = coursesData.map(data => 
      this.standCoursesRepository.create(data)
    );
    return await this.standCoursesRepository.save(courses);
  }

  private async seedTaskTypes() {
    const taskTypes = [
      'Разработка',
      'Тестирование',
      'Производство',
      'Логистика',
      'Закупки',
      'Продажи',
      'Маркетинг',
      'Бухгалтерия',
      'HR',
      'Администрирование'
    ];

    const createdTaskTypes = await Promise.all(
      taskTypes.map(async (name) => {
        const taskType = this.taskTypesRepository.create({ name });
        return await this.taskTypesRepository.save(taskType);
      })
    );

    console.log(`Created ${createdTaskTypes.length} task types`);
    return createdTaskTypes;
  }

  private async seedSupplierComponents() {
    const suppliers = await this.suppliersRepository.find();
    const components = await this.componentsRepository.find();

    if (suppliers.length === 0 || components.length === 0) {
      console.log('No suppliers or components found to create supplier components');
      return [];
    }

    const supplierComponents: Array<SupplierComponents> = [];
    for (const supplier of suppliers) {
      // Для каждого поставщика создаем связи с 3-5 случайными компонентами
      const numComponents = faker.number.int({ min: 3, max: 5 });
      const randomComponents = faker.helpers.arrayElements(components, numComponents);

      for (const component of randomComponents) {
        const supplierComponent = this.supplierComponentsRepository.create({
          supplierId: supplier.id,
          componentId: component.id,
          productUrl: faker.internet.url()
        });
        supplierComponents.push(supplierComponent);
      }
    }

    const createdSupplierComponents = await this.supplierComponentsRepository.save(supplierComponents);
    console.log(`Created ${createdSupplierComponents.length} supplier components`);
    return createdSupplierComponents;
  }
} 