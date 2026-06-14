import { CurrentTasksService } from './current_tasks.service';

const currentTasksRepo = {
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
};
const employeeRepo = {
  findOne: jest.fn(),
};
const currentTaskStatesRepo = {
  findOne: jest.fn(),
};
const shipmentStandsRepo = {};
const standTasksRepo = {};
const standRepo = {};
const userRepo = {};
const wsGateway = {};
const currentTaskStatesLogService = {
  logStateChange: jest.fn(),
};
const componentQuantityWatcher = {};
const serverWriteoffBusiness = {};
const notifyUsersService = {
  sendNotificationToUser: jest.fn(),
};

let service: CurrentTasksService;
beforeEach(() => {
  jest.resetAllMocks();

  service = new CurrentTasksService(
    currentTasksRepo as any,
    employeeRepo as any,
    currentTaskStatesRepo as any,
    shipmentStandsRepo as any,
    standTasksRepo as any,
    standRepo as any,
    userRepo as any,
    wsGateway as any,
    currentTaskStatesLogService as any,
    componentQuantityWatcher as any,
    serverWriteoffBusiness as any,
    notifyUsersService as any,
  );
});

describe('Выполнение задач', () => {
  console.log('Тестирование текущих задач');
  const currentTaskId = 1;
  const employeeId = 2;
  const currentTask = {
    id: 1,
    standTasks: {
      id: 10,
      title: 'Сборка БП',
    },
    shipmentStands: {
      stands: {
        title: 'Стенд №1',
        employees: {
          users: [
            {
              id: 2,
            },
          ],
        },
      },
    },
  };

  describe('Старт задачи', () => {
    describe('Ошибки', () => {
      it('Должно выбросить ошибку, если текущая задача не найдена', async () => {
        currentTasksRepo.findOne.mockResolvedValue(null);

        await expect(service.startTask(1, 2)).rejects.toThrow(
          'Задача не найдена',
        );
      });

      it('Должно выбросить ошибку, если сотрудник не найден', async () => {
        currentTasksRepo.find.mockResolvedValue([]);
        currentTasksRepo.findOne.mockResolvedValue({
          id: 1,
          standTasks: { id: 10 },
        });

        employeeRepo.findOne.mockResolvedValue(null);

        await expect(service.startTask(1, 2)).rejects.toThrow(
          'Сотрудник не найден',
        );
      });

      it('Должно вывести ошибку, если статус задачи не найден', async () => {
        currentTasksRepo.find.mockResolvedValue([]);
        currentTasksRepo.findOne.mockResolvedValue({
          id: 1,
          standTasks: { id: 10 },
        });

        employeeRepo.findOne.mockResolvedValue({});

        currentTaskStatesRepo.findOne.mockResolvedValue(null);

        await expect(service.startTask(1, 2)).rejects.toThrow(
          'Статус задачи не найден',
        );
      });
    });

    describe('Отправка уведомления', () => {
      it('Должно отправиться уведомление пользователю', async () => {
        currentTasksRepo.find.mockResolvedValue([]);
        currentTasksRepo.findOne.mockResolvedValue(currentTask);

        employeeRepo.findOne.mockResolvedValue({});

        currentTaskStatesRepo.findOne.mockResolvedValue({
          id: 1,
          title: 'Выполняется',
        });

        notifyUsersService.sendNotificationToUser.mockResolvedValue(undefined);

        await service.startTask(1, 2);

        expect(notifyUsersService.sendNotificationToUser).toHaveBeenCalledWith(
          2,
          {
            message: `Задача "${currentTask.standTasks?.title}" на стенде "${currentTask.shipmentStands?.stands?.title}" начата`,
            type: 'task_started',
          },
        );
      });
    });

    it('Задача должна поменять свой статус на Выполняется', async () => {
      currentTasksRepo.find.mockResolvedValue([]);
      currentTasksRepo.findOne.mockResolvedValue({
        id: 1,
        standTasks: { id: 10 },
      });
      employeeRepo.findOne.mockResolvedValue({});
      currentTaskStatesRepo.findOne.mockResolvedValue({
        id: 2,
        title: 'Выполняется',
      });

      currentTaskStatesLogService.logStateChange.mockResolvedValue(undefined);
      currentTasksRepo.save.mockResolvedValue(currentTask);

      await service.startTask(1, 2);

      expect(currentTaskStatesLogService.logStateChange).toHaveBeenCalledWith(
        currentTask.id,
        2,
      );
    });
  });
});
