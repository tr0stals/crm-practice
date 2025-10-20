# Inventarization Business Service

Этот модуль предоставляет бизнес-логику для автоматического расчета инвентаризации компонентов.

## Основной принцип расчета

**Формула расчета:**
```
N = inv (последняя инвентаризация) + приход - выполненные задачи - списания
```

Где:
- `inv` - количество компонентов по последней инвентаризации
- `приход` - количество компонентов, поступивших по накладным
- `выполненные задачи` - количество компонентов, израсходованных в выполненных задачах (статус COMPLETED)
- `списания` - количество компонентов, списанных вручную

## Архитектура

Модуль следует паттернам проекта:
- **Feature-based**: Бизнес-логика вынесена в `/src/features/inventarization-business/`
- **TypeORM QueryBuilder**: Для сложных запросов используются связи сущностей
- **Интеграция**: Модуль интегрирован с существующим `InventarizationModule`

## API эндпоинты

### 1. Расчет количества для одного компонента
```
GET /inventarization/calculate/:componentId?factoryId=X&calculationDate=YYYY-MM-DD
```

### 2. Массовый расчет компонентов
```
POST /inventarization/calculate-multiple
Body: {
  componentIds?: number[],  // опционально, если не указано - все компоненты
  factoryId: number,        // обязательный параметр
  calculationDate?: Date    // опционально, по умолчанию текущая дата
}
```

### 3. Создание инвентаризации на основе расчета
```
POST /inventarization/create-from-calculation
Body: {
  componentIds?: number[],
  factoryId: number,
  calculationDate?: Date,
  quality: number            // качество инвентаризации (0-100)
}
```

### 4. Обновление количества компонента на основе расчета
```
PATCH /inventarization/update-quantity/:componentId?factoryId=X&calculationDate=YYYY-MM-DD
```

### 5. Массовое обновление количества компонентов
```
PATCH /inventarization/update-multiple-quantity
Body: {
  componentIds?: number[],  // опционально, если не указано - все компоненты
  factoryId: number,        // обязательный параметр
  calculationDate?: Date    // опционально, по умолчанию текущая дата
}
```

### 6. Пересчет количества всех компонентов для фабрики
```
PATCH /inventarization/recalculate-all/:factoryId?calculationDate=YYYY-MM-DD
```

## Примеры использования

### Расчет для конкретного компонента
```javascript
const result = await fetch('/inventarization/calculate/123?factoryId=1');
// Ответ:
{
  componentId: 123,
  component: { id: 123, title: "Резистор 10kOm" },
  calculatedCount: 150,
  calculationDate: "2024-01-15",
  lastInventarizationCount: 100,
  arrivalCount: 80,
  completedTaskCount: 20,
  writeoffCount: 10
}
```

### Массовый расчет для всех компонентов фабрики
```javascript
const result = await fetch('/inventarization/calculate-multiple', {
  method: 'POST',
  body: JSON.stringify({
    factoryId: 1,
    calculationDate: "2024-01-15"
  })
});
```

### Создание инвентаризации
```javascript
const result = await fetch('/inventarization/create-from-calculation', {
  method: 'POST',
  body: JSON.stringify({
    factoryId: 1,
    componentIds: [1, 2, 3],
    calculationDate: "2024-01-15",
    quality: 95
  })
});
```

### Обновление количества компонента
```javascript
const result = await fetch('/inventarization/update-quantity/123?factoryId=1', {
  method: 'PATCH'
});
// Ответ: обновленный компонент с новым полем quantity
```

### Массовое обновление количества компонентов
```javascript
const result = await fetch('/inventarization/update-multiple-quantity', {
  method: 'PATCH',
  body: JSON.stringify({
    factoryId: 1,
    componentIds: [1, 2, 3],
    calculationDate: "2024-01-15"
  })
});
```

### Пересчет всех компонентов фабрики
```javascript
const result = await fetch('/inventarization/recalculate-all/1', {
  method: 'PATCH'
});
```

## Особенности реализации

1. **Временные периоды** - расчет учитывает операции только после последней инвентаризации
2. **Фильтрация по фабрике** - все расчеты выполняются в контексте конкретной фабрики
3. **Защита от ошибок** - итоговое количество не может быть отрицательным
4. **TypeORM связи** - используются правильные связи между сущностями
5. **Валидация** - обязательные параметры проверяются на уровне сервиса
6. **Поле quantity** - в сущность Components добавлено поле для хранения текущего количества компонента

## Работа с полем quantity

Поле `quantity` в сущности `Components` автоматически обновляется при использовании следующих эндпоинтов:
- `PATCH /inventarization/update-quantity/:componentId` - обновление одного компонента
- `PATCH /inventarization/update-multiple-quantity` - массовое обновление
- `PATCH /inventarization/recalculate-all/:factoryId` - пересчет всех компонентов фабрики

**Формула расчета поля quantity:**
```
quantity = последняя_инвентаризация + приход - выполненные_задачи - списания
```

## Структура модуля

```
src/features/inventarization-business/
├── inventarization-business.service.ts    # Основная бизнес-логика
├── inventarization-business.module.ts     # NestJS модуль
├── dto/inventarization-calculation.dto.ts # DTO для запросов
└── README.md                             # Документация
```

## Интеграция с существующим модулем

Модуль интегрирован с существующим `InventarizationModule` и доступен через:
- `InventarizationService.calculateComponentCount()`
- `InventarizationService.calculateMultipleComponents()`
- `InventarizationService.createInventarizationFromCalculation()`