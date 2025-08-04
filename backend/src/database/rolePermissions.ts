export interface RolePermission {
  read: boolean;
  write: boolean;
  writeSelf: boolean; // RWs - чтение/запись только своих
}

export interface EntityPermissions {
  [role: string]: RolePermission;
}

export interface PermissionMatrix {
  [entity: string]: EntityPermissions;
}

/**
 * Матрица прав доступа для всех ролей и сущностей
 * R - чтение (read: true, write: false, writeSelf: false)
 * RW - чтение/запись (read: true, write: true, writeSelf: false)
 * RWs - чтение/запись только своих (read: true, write: false, writeSelf: true)
 * - - нет доступа (read: false, write: false, writeSelf: false)
 */
export const PERMISSION_MATRIX: PermissionMatrix = {
  // Накладные
  'arrival_invoices': {
    'Администратор': { read: true, write: true, writeSelf: false },
    'Директор': { read: true, write: true, writeSelf: false },
    'Бухгалтер': { read: true, write: false, writeSelf: false },
    'Зав. производством': { read: true, write: true, writeSelf: false },
    'Снабженец': { read: true, write: true, writeSelf: false },
    'Программист': { read: false, write: false, writeSelf: false },
    'Дизайнер': { read: false, write: false, writeSelf: false },
    'Конструктор': { read: false, write: false, writeSelf: false },
    'Инженер': { read: false, write: false, writeSelf: false },
    'Монтажник': { read: false, write: false, writeSelf: false },
    'Слесарь': { read: false, write: false, writeSelf: false },
    'Токарь': { read: false, write: false, writeSelf: false },
    'Фрезеровщик': { read: false, write: false, writeSelf: false },
    'Сварщик': { read: false, write: false, writeSelf: false },
    'Столяр': { read: false, write: false, writeSelf: false },
    'Технолог ПП': { read: false, write: false, writeSelf: false },
    'Покрасчик': { read: false, write: false, writeSelf: false }
  },

  // Счета
  'bills_for_pay': {
    'Администратор': { read: true, write: true, writeSelf: false },
    'Директор': { read: true, write: false, writeSelf: false },
    'Бухгалтер': { read: true, write: false, writeSelf: false },
    'Зав. производством': { read: true, write: true, writeSelf: false },
    'Снабженец': { read: true, write: true, writeSelf: false },
    'Программист': { read: false, write: false, writeSelf: false },
    'Дизайнер': { read: false, write: false, writeSelf: false },
    'Конструктор': { read: false, write: false, writeSelf: false },
    'Инженер': { read: false, write: false, writeSelf: false },
    'Монтажник': { read: false, write: false, writeSelf: false },
    'Слесарь': { read: false, write: false, writeSelf: false },
    'Токарь': { read: false, write: false, writeSelf: false },
    'Фрезеровщик': { read: false, write: false, writeSelf: false },
    'Сварщик': { read: false, write: false, writeSelf: false },
    'Столяр': { read: false, write: false, writeSelf: false },
    'Технолог ПП': { read: false, write: false, writeSelf: false },
    'Покрасчик': { read: false, write: false, writeSelf: false }
  },

  // Компоненты
  'components': {
    'Администратор': { read: true, write: true, writeSelf: false },
    'Директор': { read: true, write: false, writeSelf: false },
    'Бухгалтер': { read: true, write: false, writeSelf: false },
    'Зав. производством': { read: true, write: true, writeSelf: false },
    'Снабженец': { read: true, write: true, writeSelf: false },
    'Программист': { read: false, write: false, writeSelf: false },
    'Дизайнер': { read: false, write: false, writeSelf: false },
    'Конструктор': { read: true, write: true, writeSelf: false },
    'Инженер': { read: true, write: true, writeSelf: false },
    'Монтажник': { read: true, write: false, writeSelf: false },
    'Слесарь': { read: true, write: false, writeSelf: false },
    'Токарь': { read: true, write: false, writeSelf: false },
    'Фрезеровщик': { read: true, write: false, writeSelf: false },
    'Сварщик': { read: true, write: false, writeSelf: false },
    'Столяр': { read: true, write: false, writeSelf: false },
    'Технолог ПП': { read: true, write: false, writeSelf: false },
    'Покрасчик': { read: true, write: false, writeSelf: false }
  },

  // Текущие задачи
  'current_tasks': {
    'Администратор': { read: true, write: true, writeSelf: false },
    'Директор': { read: true, write: false, writeSelf: false },
    'Бухгалтер': { read: false, write: false, writeSelf: false },
    'Зав. производством': { read: true, write: true, writeSelf: false },
    'Снабженец': { read: true, write: true, writeSelf: false },
    'Программист': { read: true, write: true, writeSelf: false },
    'Дизайнер': { read: false, write: false, writeSelf: false },
    'Конструктор': { read: true, write: true, writeSelf: false },
    'Инженер': { read: true, write: true, writeSelf: false },
    'Монтажник': { read: true, write: false, writeSelf: true },
    'Слесарь': { read: true, write: false, writeSelf: true },
    'Токарь': { read: true, write: false, writeSelf: true },
    'Фрезеровщик': { read: true, write: false, writeSelf: true },
    'Сварщик': { read: true, write: false, writeSelf: true },
    'Столяр': { read: true, write: false, writeSelf: true },
    'Технолог ПП': { read: true, write: false, writeSelf: true },
    'Покрасчик': { read: true, write: false, writeSelf: true }
  },

  // Текущие задачи
  'current_task_states': {
    'Администратор': { read: true, write: true, writeSelf: false },
    'Директор': { read: false, write: false, writeSelf: false },
    'Бухгалтер': { read: false, write: false, writeSelf: false },
    'Зав. производством': { read: true, write: true, writeSelf: false },
    'Снабженец': { read: false, write: false, writeSelf: false },
    'Программист': { read: false, write: false, writeSelf: false },
    'Дизайнер': { read: false, write: false, writeSelf: false },
    'Конструктор': { read: false, write: false, writeSelf: false },
    'Инженер': { read: false, write: false, writeSelf: false },
    'Монтажник': { read: false, write: false, writeSelf: false },
    'Слесарь': { read: false, write: false, writeSelf: false },
    'Токарь': { read: false, write: false, writeSelf: false },
    'Фрезеровщик': { read: false, write: false, writeSelf: false },
    'Сварщик': { read: false, write: false, writeSelf: false },
    'Столяр': { read: false, write: false, writeSelf: false },
    'Технолог ПП': { read: false, write: false, writeSelf: false },
    'Покрасчик': { read: false, write: false, writeSelf: false }
  },

  // Текущие задачи
  'current_task_states_log': {
    'Администратор': { read: true, write: true, writeSelf: false },
    'Директор': { read: false, write: false, writeSelf: false },
    'Бухгалтер': { read: false, write: false, writeSelf: false },
    'Зав. производством': { read: true, write: true, writeSelf: false },
    'Снабженец': { read: false, write: false, writeSelf: false },
    'Программист': { read: false, write: false, writeSelf: false },
    'Дизайнер': { read: false, write: false, writeSelf: false },
    'Конструктор': { read: false, write: false, writeSelf: false },
    'Инженер': { read: false, write: false, writeSelf: false },
    'Монтажник': { read: false, write: false, writeSelf: false },
    'Слесарь': { read: false, write: false, writeSelf: false },
    'Токарь': { read: false, write: false, writeSelf: false },
    'Фрезеровщик': { read: false, write: false, writeSelf: false },
    'Сварщик': { read: false, write: false, writeSelf: false },
    'Столяр': { read: false, write: false, writeSelf: false },
    'Технолог ПП': { read: false, write: false, writeSelf: false },
    'Покрасчик': { read: false, write: false, writeSelf: false }
  },

  // Сотрудники
  'employees': {
    'Администратор': { read: true, write: true, writeSelf: false },
    'Директор': { read: true, write: true, writeSelf: false },
    'Бухгалтер': { read: true, write: false, writeSelf: false },
    'Зав. производством': { read: true, write: true, writeSelf: false },
    'Снабженец': { read: false, write: false, writeSelf: false },
    'Программист': { read: false, write: false, writeSelf: false },
    'Дизайнер': { read: false, write: false, writeSelf: false },
    'Конструктор': { read: true, write: false, writeSelf: false },
    'Инженер': { read: true, write: false, writeSelf: false },
    'Монтажник': { read: false, write: false, writeSelf: false },
    'Слесарь': { read: false, write: false, writeSelf: false },
    'Токарь': { read: false, write: false, writeSelf: false },
    'Фрезеровщик': { read: false, write: false, writeSelf: false },
    'Сварщик': { read: false, write: false, writeSelf: false },
    'Столяр': { read: false, write: false, writeSelf: false },
    'Технолог ПП': { read: false, write: false, writeSelf: false },
    'Покрасчик': { read: false, write: false, writeSelf: false }
  },

  // Инвентаризации
  'inventarization': {
    'Администратор': { read: true, write: true, writeSelf: false },
    'Директор': { read: true, write: false, writeSelf: false },
    'Бухгалтер': { read: true, write: false, writeSelf: false },
    'Зав. производством': { read: true, write: true, writeSelf: false },
    'Снабженец': { read: true, write: true, writeSelf: false },
    'Программист': { read: false, write: false, writeSelf: false },
    'Дизайнер': { read: false, write: false, writeSelf: false },
    'Конструктор': { read: false, write: false, writeSelf: false },
    'Инженер': { read: false, write: false, writeSelf: false },
    'Монтажник': { read: false, write: false, writeSelf: false },
    'Слесарь': { read: false, write: false, writeSelf: false },
    'Токарь': { read: false, write: false, writeSelf: false },
    'Фрезеровщик': { read: false, write: false, writeSelf: false },
    'Сварщик': { read: false, write: false, writeSelf: false },
    'Столяр': { read: false, write: false, writeSelf: false },
    'Технолог ПП': { read: false, write: false, writeSelf: false },
    'Покрасчик': { read: false, write: false, writeSelf: false }
  },

  // Лицензии
  'license': {
    'Администратор': { read: true, write: true, writeSelf: false },
    'Директор': { read: true, write: false, writeSelf: false },
    'Бухгалтер': { read: false, write: false, writeSelf: false },
    'Зав. производством': { read: true, write: true, writeSelf: false },
    'Снабженец': { read: false, write: false, writeSelf: false },
    'Программист': { read: true, write: true, writeSelf: false },
    'Дизайнер': { read: false, write: false, writeSelf: false },
    'Конструктор': { read: false, write: false, writeSelf: false },
    'Инженер': { read: true, write: true, writeSelf: false },
    'Монтажник': { read: false, write: false, writeSelf: false },
    'Слесарь': { read: false, write: false, writeSelf: false },
    'Токарь': { read: false, write: false, writeSelf: false },
    'Фрезеровщик': { read: false, write: false, writeSelf: false },
    'Сварщик': { read: false, write: false, writeSelf: false },
    'Столяр': { read: false, write: false, writeSelf: false },
    'Технолог ПП': { read: false, write: false, writeSelf: false },
    'Покрасчик': { read: false, write: false, writeSelf: false }
  },

  // Заявки на заказ
  'order_requests': {
    'Администратор': { read: true, write: true, writeSelf: false },
    'Директор': { read: true, write: false, writeSelf: false },
    'Бухгалтер': { read: false, write: false, writeSelf: false },
    'Зав. производством': { read: true, write: true, writeSelf: false },
    'Снабженец': { read: true, write: true, writeSelf: false },
    'Программист': { read: true, write: false, writeSelf: true },
    'Дизайнер': { read: false, write: false, writeSelf: false },
    'Конструктор': { read: true, write: false, writeSelf: true },
    'Инженер': { read: true, write: false, writeSelf: true },
    'Монтажник': { read: true, write: true, writeSelf: false },
    'Слесарь': { read: true, write: true, writeSelf: false },
    'Токарь': { read: true, write: true, writeSelf: false },
    'Фрезеровщик': { read: true, write: true, writeSelf: false },
    'Сварщик': { read: true, write: true, writeSelf: false },
    'Столяр': { read: true, write: true, writeSelf: false },
    'Технолог ПП': { read: true, write: true, writeSelf: false },
    'Покрасчик': { read: true, write: true, writeSelf: false }
  },

  // Организации
  'organizations': {
    'Администратор': { read: true, write: true, writeSelf: false },
    'Директор': { read: true, write: true, writeSelf: false },
    'Бухгалтер': { read: true, write: false, writeSelf: false },
    'Зав. производством': { read: true, write: true, writeSelf: false },
    'Снабженец': { read: true, write: true, writeSelf: false },
    'Программист': { read: true, write: false, writeSelf: false },
    'Дизайнер': { read: false, write: false, writeSelf: false },
    'Конструктор': { read: true, write: false, writeSelf: false },
    'Инженер': { read: true, write: false, writeSelf: false },
    'Монтажник': { read: false, write: false, writeSelf: false },
    'Слесарь': { read: false, write: false, writeSelf: false },
    'Токарь': { read: false, write: false, writeSelf: false },
    'Фрезеровщик': { read: false, write: false, writeSelf: false },
    'Сварщик': { read: false, write: false, writeSelf: false },
    'Столяр': { read: false, write: false, writeSelf: false },
    'Технолог ПП': { read: false, write: false, writeSelf: false },
    'Покрасчик': { read: false, write: false, writeSelf: false }
  },

  // Заказы печатных плат
  'pcb_orders': {
    'Администратор': { read: true, write: true, writeSelf: false },
    'Директор': { read: true, write: false, writeSelf: false },
    'Бухгалтер': { read: true, write: false, writeSelf: false },
    'Зав. производством': { read: true, write: true, writeSelf: false },
    'Снабженец': { read: true, write: true, writeSelf: false },
    'Программист': { read: false, write: false, writeSelf: false },
    'Дизайнер': { read: false, write: false, writeSelf: false },
    'Конструктор': { read: false, write: false, writeSelf: false },
    'Инженер': { read: true, write: true, writeSelf: false },
    'Монтажник': { read: true, write: true, writeSelf: false },
    'Слесарь': { read: false, write: false, writeSelf: false },
    'Токарь': { read: false, write: false, writeSelf: false },
    'Фрезеровщик': { read: false, write: false, writeSelf: false },
    'Сварщик': { read: false, write: false, writeSelf: false },
    'Столяр': { read: false, write: false, writeSelf: false },
    'Технолог ПП': { read: true, write: true, writeSelf: false },
    'Покрасчик': { read: false, write: false, writeSelf: false }
  },

  // Печатные платы
  'pcbs': {
    'Администратор': { read: true, write: true, writeSelf: false },
    'Директор': { read: true, write: false, writeSelf: false },
    'Бухгалтер': { read: false, write: false, writeSelf: false },
    'Зав. производством': { read: true, write: true, writeSelf: false },
    'Снабженец': { read: true, write: false, writeSelf: false },
    'Программист': { read: false, write: false, writeSelf: false },
    'Дизайнер': { read: false, write: false, writeSelf: false },
    'Конструктор': { read: false, write: false, writeSelf: false },
    'Инженер': { read: true, write: true, writeSelf: false },
    'Монтажник': { read: true, write: true, writeSelf: false },
    'Слесарь': { read: false, write: false, writeSelf: false },
    'Токарь': { read: false, write: false, writeSelf: false },
    'Фрезеровщик': { read: false, write: false, writeSelf: false },
    'Сварщик': { read: false, write: false, writeSelf: false },
    'Столяр': { read: false, write: false, writeSelf: false },
    'Технолог ПП': { read: true, write: true, writeSelf: false },
    'Покрасчик': { read: false, write: false, writeSelf: false }
  },

  // Люди
  'peoples': {
    'Администратор': { read: true, write: true, writeSelf: false },
    'Директор': { read: true, write: true, writeSelf: false },
    'Бухгалтер': { read: false, write: false, writeSelf: false },
    'Зав. производством': { read: true, write: true, writeSelf: false },
    'Снабженец': { read: true, write: true, writeSelf: false },
    'Программист': { read: true, write: true, writeSelf: false },
    'Дизайнер': { read: false, write: false, writeSelf: false },
    'Конструктор': { read: true, write: false, writeSelf: false },
    'Инженер': { read: true, write: false, writeSelf: false },
    'Монтажник': { read: false, write: false, writeSelf: false },
    'Слесарь': { read: false, write: false, writeSelf: false },
    'Токарь': { read: false, write: false, writeSelf: false },
    'Фрезеровщик': { read: false, write: false, writeSelf: false },
    'Сварщик': { read: false, write: false, writeSelf: false },
    'Столяр': { read: false, write: false, writeSelf: false },
    'Технолог ПП': { read: false, write: false, writeSelf: false },
    'Покрасчик': { read: false, write: false, writeSelf: false }
  },

  // Профессии
  'professions': {
    'Администратор': { read: true, write: true, writeSelf: false },
    'Директор': { read: true, write: true, writeSelf: false },
    'Бухгалтер': { read: true, write: false, writeSelf: false },
    'Зав. производством': { read: true, write: true, writeSelf: false },
    'Снабженец': { read: true, write: false, writeSelf: false },
    'Программист': { read: true, write: false, writeSelf: false },
    'Дизайнер': { read: false, write: false, writeSelf: false },
    'Конструктор': { read: true, write: false, writeSelf: false },
    'Инженер': { read: true, write: false, writeSelf: false },
    'Монтажник': { read: false, write: false, writeSelf: false },
    'Слесарь': { read: false, write: false, writeSelf: false },
    'Токарь': { read: false, write: false, writeSelf: false },
    'Фрезеровщик': { read: false, write: false, writeSelf: false },
    'Сварщик': { read: false, write: false, writeSelf: false },
    'Столяр': { read: false, write: false, writeSelf: false },
    'Технолог ПП': { read: false, write: false, writeSelf: false },
    'Покрасчик': { read: false, write: false, writeSelf: false }
  },

  // Отгрузки
  'shipments': {
    'Администратор': { read: true, write: true, writeSelf: false },
    'Директор': { read: true, write: true, writeSelf: false },
    'Бухгалтер': { read: true, write: false, writeSelf: false },
    'Зав. производством': { read: true, write: true, writeSelf: false },
    'Снабженец': { read: true, write: false, writeSelf: false },
    'Программист': { read: true, write: false, writeSelf: false },
    'Дизайнер': { read: true, write: false, writeSelf: false },
    'Конструктор': { read: true, write: true, writeSelf: false },
    'Инженер': { read: true, write: true, writeSelf: false },
    'Монтажник': { read: true, write: false, writeSelf: false },
    'Слесарь': { read: true, write: false, writeSelf: false },
    'Токарь': { read: true, write: false, writeSelf: false },
    'Фрезеровщик': { read: true, write: false, writeSelf: false },
    'Сварщик': { read: true, write: false, writeSelf: false },
    'Столяр': { read: true, write: false, writeSelf: false },
    'Технолог ПП': { read: true, write: false, writeSelf: false },
    'Покрасчик': { read: true, write: false, writeSelf: false }
  },

  // Задачи стенда (тех. процесс)
  'stand_tasks': {
    'Администратор': { read: true, write: true, writeSelf: false },
    'Директор': { read: true, write: false, writeSelf: false },
    'Бухгалтер': { read: false, write: false, writeSelf: false },
    'Зав. производством': { read: true, write: true, writeSelf: false },
    'Снабженец': { read: false, write: false, writeSelf: false },
    'Программист': { read: false, write: false, writeSelf: false },
    'Дизайнер': { read: false, write: false, writeSelf: false },
    'Конструктор': { read: true, write: true, writeSelf: false },
    'Инженер': { read: true, write: true, writeSelf: false },
    'Монтажник': { read: true, write: false, writeSelf: true },
    'Слесарь': { read: true, write: false, writeSelf: true },
    'Токарь': { read: true, write: false, writeSelf: true },
    'Фрезеровщик': { read: true, write: false, writeSelf: true },
    'Сварщик': { read: true, write: false, writeSelf: true },
    'Столяр': { read: true, write: false, writeSelf: true },
    'Технолог ПП': { read: true, write: false, writeSelf: true },
    'Покрасчик': { read: true, write: false, writeSelf: true }
  },

  // Стенды
  'stands': {
    'Администратор': { read: true, write: true, writeSelf: false },
    'Директор': { read: true, write: true, writeSelf: false },
    'Бухгалтер': { read: false, write: false, writeSelf: false },
    'Зав. производством': { read: true, write: true, writeSelf: false },
    'Снабженец': { read: false, write: false, writeSelf: false },
    'Программист': { read: false, write: false, writeSelf: false },
    'Дизайнер': { read: false, write: false, writeSelf: false },
    'Конструктор': { read: true, write: true, writeSelf: false },
    'Инженер': { read: true, write: true, writeSelf: false },
    'Монтажник': { read: true, write: false, writeSelf: false },
    'Слесарь': { read: true, write: false, writeSelf: false },
    'Токарь': { read: true, write: false, writeSelf: false },
    'Фрезеровщик': { read: true, write: false, writeSelf: false },
    'Сварщик': { read: true, write: false, writeSelf: false },
    'Столяр': { read: true, write: false, writeSelf: false },
    'Технолог ПП': { read: true, write: false, writeSelf: false },
    'Покрасчик': { read: true, write: false, writeSelf: false }
  },

  // Пользователи
  'user': {
    'Администратор': { read: true, write: true, writeSelf: false },
    'Директор': { read: true, write: true, writeSelf: false },
    'Бухгалтер': { read: false, write: false, writeSelf: false },
    'Зав. производством': { read: true, write: true, writeSelf: false },
    'Снабженец': { read: false, write: false, writeSelf: false },
    'Программист': { read: false, write: false, writeSelf: false },
    'Дизайнер': { read: false, write: false, writeSelf: false },
    'Конструктор': { read: false, write: false, writeSelf: false },
    'Инженер': { read: false, write: false, writeSelf: false },
    'Монтажник': { read: false, write: false, writeSelf: false },
    'Слесарь': { read: false, write: false, writeSelf: false },
    'Токарь': { read: false, write: false, writeSelf: false },
    'Фрезеровщик': { read: false, write: false, writeSelf: false },
    'Сварщик': { read: false, write: false, writeSelf: false },
    'Столяр': { read: false, write: false, writeSelf: false },
    'Технолог ПП': { read: false, write: false, writeSelf: false },
    'Покрасчик': { read: false, write: false, writeSelf: false }
  },

  // Списания
  'writeoff': {
    'Администратор': { read: true, write: true, writeSelf: false },
    'Директор': { read: true, write: true, writeSelf: false },
    'Бухгалтер': { read: true, write: false, writeSelf: false },
    'Зав. производством': { read: true, write: true, writeSelf: false },
    'Снабженец': { read: true, write: true, writeSelf: false },
    'Программист': { read: false, write: false, writeSelf: false },
    'Дизайнер': { read: false, write: false, writeSelf: false },
    'Конструктор': { read: false, write: false, writeSelf: false },
    'Инженер': { read: false, write: false, writeSelf: false },
    'Монтажник': { read: false, write: false, writeSelf: false },
    'Слесарь': { read: false, write: false, writeSelf: false },
    'Токарь': { read: false, write: false, writeSelf: false },
    'Фрезеровщик': { read: false, write: false, writeSelf: false },
    'Сварщик': { read: false, write: false, writeSelf: false },
    'Столяр': { read: false, write: false, writeSelf: false },
    'Технолог ПП': { read: false, write: false, writeSelf: false },
    'Покрасчик': { read: false, write: false, writeSelf: false }
  }
};

/**
 * Получить права доступа для роли и сущности
 */
export function getRolePermissions(entity: string, role: string): RolePermission {
  const entityPermissions = PERMISSION_MATRIX[entity];
  if (!entityPermissions) {
    return { read: false, write: false, writeSelf: false };
  }

  const permissions = entityPermissions[role];
  if (!permissions) {
    return { read: false, write: false, writeSelf: false };
  }

  return permissions;
}

/**
 * Проверить, может ли роль читать сущность
 */
export function canRead(entity: string, role: string): boolean {
  return getRolePermissions(entity, role).read;
}

/**
 * Проверить, может ли роль записывать в сущность
 */
export function canWrite(entity: string, role: string): boolean {
  const permissions = getRolePermissions(entity, role);
  return permissions.write || permissions.writeSelf;
}

/**
 * Проверить, может ли роль записывать только свои записи
 */
export function canWriteSelf(entity: string, role: string): boolean {
  return getRolePermissions(entity, role).writeSelf;
}

/**
 * Получить список сущностей, доступных для роли
 */
export function getAvailableEntities(role: string): string[] {
  return Object.keys(PERMISSION_MATRIX).filter(entity => 
    canRead(entity, role)
  );
}

/**
 * Получить список сущностей для TreeView с учетом прав доступа
 */
export function getTreeViewEntities(role: string): string[] {
  // Список сущностей, которые должны отображаться в TreeView
  const treeViewEntities = [
    'arrival_invoices',
    'bills_for_pay', 
    'components',
    'current_tasks',
    'current_task_states',
    'current_task_states_log',
    'employees',
    'inventarization',
    'license',
    'order_requests',
    'organizations',
    'pcb_orders',
    'pcbs',
    'peoples',
    'professions',
    'shipments',
    'stand_tasks',
    'stands',
    'user',
    'writeoff'
  ];

  return treeViewEntities.filter(entity => canRead(entity, role));
} 