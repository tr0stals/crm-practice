import { ComponentQuantityWatcherService } from './component-quantity-watcher.service';

const organizationsRepo = {
  findOne: jest.fn(),
};

const componentsRepo = {
  update: jest.fn(),
};

const inventarizationRepo = {
  create: jest.fn(),
  save: jest.fn(),
};

const inventarizationBusinessService = {
  getLastInventarization: jest.fn(),
  updateComponentQuantity: jest.fn(),
};

const notifyUsersService = {
  sendNotificationToUser: jest.fn(),
};

const standTasksComponentsRepo = {};
const arrivalInvoicesRepo = {};
const currentTasksRepo = {};
const currentTasksComponentsRepo = {};
const writeoffRepo = {};
const invoicesComponentsRepo = {};
const wsGateway = {};

let service: ComponentQuantityWatcherService;
beforeEach(() => {
  jest.resetAllMocks();

  service = new ComponentQuantityWatcherService(
    componentsRepo as any,
    invoicesComponentsRepo as any,
    writeoffRepo as any,
    currentTasksComponentsRepo as any,
    currentTasksRepo as any,
    arrivalInvoicesRepo as any,
    standTasksComponentsRepo as any,
    inventarizationRepo as any,
    organizationsRepo as any,
    inventarizationBusinessService as any,
    wsGateway as any,
    notifyUsersService as any,
  );
});

describe('Тестирование перерасчета компонентов на выходе после выполнения текущей задачи', () => {
  const count = 1;
  const testComponent = {
    id: 2,
    parentId: null,
    title: 'Блок питания',
    photo: '352feedb-e6b5-4135-9703-46f41379fe38.png',
    width: 55,
    height: 55,
    thickness: 100,
    weight: 100,
    material: 'Акрил',
    receiptDate: null,
    drawingReference: 'https://ru.pinterest.com/',
    quantity: 0,
  };

  it('Должен выбросить ошибку, если фабрика не найдена', async () => {
    organizationsRepo.findOne.mockResolvedValue(null);

    await expect(
      service.calculateComponentOutCount(testComponent as any, count),
    ).rejects.toThrow('Не удалось определить фабрику');
  });

  it('Должен обновить количество компонента, если фабрика найдена', async () => {
    organizationsRepo.findOne.mockResolvedValue({
      id: 5,
      shortName: 'А-Практикум',
    });

    await service.calculateComponentOutCount(testComponent as any, count);
    // componentsRepo.update.mockRejectedValue({});

    expect(componentsRepo.update).toHaveBeenCalledWith(testComponent.id, {
      quantity: count,
    });
  });

  it('Должен создать новую инвентаризацию, если фабрика найдена', async () => {
    console.log('======== create inventarization =========');
    organizationsRepo.findOne.mockResolvedValue({
      id: 5,
      shortName: 'А-Практикум',
    });

    inventarizationBusinessService.getLastInventarization.mockResolvedValue(
      null,
    );
    inventarizationRepo.create.mockReturnValue({
      componentCount: count,
      inventarizationQuality: 100,
      inventarizationDate: expect.any(Date),
      component: testComponent,
      factory: { id: 5 },
    });
    inventarizationRepo.save.mockResolvedValue({
      componentCount: count,
      inventarizationQuality: 100,
      inventarizationDate: expect.any(Date),
      component: testComponent,
      factory: { id: 5 },
    });

    await service.calculateComponentOutCount(testComponent as any, count);

    expect(inventarizationRepo.create).toHaveBeenCalledWith({
      componentCount: count,
      inventarizationQuality: 100,
      inventarizationDate: expect.any(Date),
      component: testComponent,
      factory: { id: 5 },
    });

    expect(inventarizationRepo.save).toHaveBeenCalledWith({
      componentCount: count,
      inventarizationQuality: 100,
      inventarizationDate: expect.any(Date),
      component: testComponent,
      factory: { id: 5 },
    });
  });

  it('Должен вывести ошибку при проблемах с БД', async () => {
    organizationsRepo.findOne.mockResolvedValue({
      id: 5,
      shortName: 'А-Практикум',
    });

    componentsRepo.update.mockRejectedValue(new Error('DB Error'));

    await expect(
      service.calculateComponentOutCount(testComponent as any, count),
    ).rejects.toThrow('Не удалось обновить данные компонента');
  });
});

describe('Автоматический перерасчет количества компонентов', () => {
  describe('Обновление количества компонента', () => {
    const componentId = 7;
    const standTaskId = 3;
    const factoryId = 5;
    const count = 1;

    it('Должен обновить количество компонента, если фабрика найдена', async () => {
      inventarizationBusinessService.updateComponentQuantity.mockResolvedValue({
        id: 7,
        parentId: null,
        title: 'Блок питания',
        photo: '352feedb-e6b5-4135-9703-46f41379fe38.png',
        width: 55,
        height: 55,
        thickness: 100,
        weight: 100,
        material: 'Акрил',
        receiptDate: null,
        drawingReference: 'https://ru.pinterest.com/',
        quantity: count,
      });

      await service.recalculateComponentQuantity(
        componentId,
        standTaskId,
        factoryId,
      );

      expect(
        inventarizationBusinessService.updateComponentQuantity,
      ).toHaveBeenCalledWith(componentId, factoryId, standTaskId);
    });
  });
});
